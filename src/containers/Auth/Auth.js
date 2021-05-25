import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { validationRules } from '../../utils/validation/validationRules';
import { SET_USER_DATA } from '../../reduxStore/actionTypes';
import { setAuthTimeout } from '../../reduxStore/actions';

const Auth = props => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState({ value: null, isValid: true });
  const [address, setAddress] = useState({ value: null, isValid: true });
  const [email, setEmail] = useState({ value: null, isValid: true });
  const [password, setPassword] = useState({ value: null, isValid: true });
  const dispatch = useDispatch();

  const login = async () => {
    if (isSignup) return setIsSignup(false);
    if (!email.isValid || !email.value)
      return document.getElementById('email').focus();
    if (!password.isValid || !password.value)
      return document.getElementById('password').focus();
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch({
        type: SET_USER_DATA,
        data: {
          token: response.token,
          name: response.name,
          role: response.role,
        },
      });
      localStorage.setItem('token', response.token);
      localStorage.setItem('name', response.name);
      localStorage.setItem('role', response.role);
      localStorage.setItem(
        'expirationDate',
        new Date(new Date().getTime() + response.expiresIn * 1000)
      );
      dispatch(setAuthTimeout(response.expiresIn))
    } catch (error) {
      alert(error);
    }
  };
  const signup = async event => {
    event.preventDefault();
    if (!isSignup) return setIsSignup(true);
    if (!name.isValid || !name.value)
      return document.getElementById('name').focus();
    if (!address.isValid || !address.value)
      return document.getElementById('address').focus();
    if (!email.isValid || !email.value)
      return document.getElementById('email').focus();
    if (!password.isValid || !password.value)
      return document.getElementById('password').focus();
    if (!role) return alert('Please select role');
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: role,
          name: name.value,
          address: address.value,
          email: email.value,
          password: password.value,
        }),
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      setIsSignup(false);
      login();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <React.Fragment>
      <form
        className="AuthBox"
        onSubmit={signup}
        onKeyDown={event =>
          event.code === 'Enter'
            ? isSignup
              ? signup(event)
              : login(event)
            : null
        }
      >
        <Box className="AuthBox__InputBox">
          {isSignup ? (
            <React.Fragment>
              <RadioGroup
                aria-label="role"
                name="role"
                onChange={event => setRole(event.target.value)}
              >
                <FormControlLabel
                  value="human_resources"
                  control={<Radio />}
                  label="Human Resources"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="employee"
                  control={<Radio />}
                  label="Employee"
                  labelPlacement="end"
                />
              </RadioGroup>
              <TextField
                placeholder="John Smith"
                id="name"
                label="Name"
                size="small"
                margin="dense"
                variant="outlined"
                autoComplete="name"
                error={!name.isValid}
                onBlur={event =>
                  setName({
                    ...name,
                    isValid: validationRules.name(event.target.value),
                  })
                }
                onChange={event =>
                  setName({
                    value: event.target.value,
                    isValid: name.isValid
                      ? true
                      : validationRules.name(event.target.value),
                  })
                }
              />
              <TextField
                placeholder="Jurgilų g. 17, Tytuvėnai"
                id="address"
                label="Address"
                size="small"
                margin="dense"
                variant="outlined"
                autoComplete="address"
                error={!address.isValid}
                onBlur={event =>
                  setAddress({
                    ...address,
                    isValid: validationRules.address(event.target.value),
                  })
                }
                onChange={event =>
                  setAddress({
                    value: event.target.value,
                    isValid: address.isValid
                      ? true
                      : validationRules.address(event.target.value),
                  })
                }
              />
            </React.Fragment>
          ) : null}
          <TextField
            placeholder="email@test.com"
            type="email"
            id="email"
            label="Email"
            size="small"
            margin="dense"
            variant="outlined"
            autoComplete="email"
            error={!email.isValid}
            onBlur={event =>
              setEmail({
                ...email,
                isValid: validationRules.email(event.target.value),
              })
            }
            onChange={event =>
              setEmail({
                value: event.target.value,
                isValid: email.isValid
                  ? true
                  : validationRules.email(event.target.value),
              })
            }
          />
          <TextField
            label="Password"
            size="small"
            margin="dense"
            variant="outlined"
            type="password"
            id="password"
            error={!password.isValid}
            onBlur={event =>
              setPassword({
                ...password,
                isValid: validationRules.password(event.target.value),
              })
            }
            onChange={event =>
              setPassword({
                value: event.target.value,
                isValid: password.isValid
                  ? true
                  : validationRules.password(event.target.value),
              })
            }
          />
        </Box>
        <Box className="AuthBox__ButtonBox">
          <Button
            color="primary"
            variant="contained"
            onClick={event => login(event)}
          >
            {isSignup ? 'To log in' : 'Log in'}
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={event => signup(event)}
          >
            {isSignup ? 'Sign up' : 'To sign up'}
          </Button>
        </Box>
      </form>
    </React.Fragment>
  );
};
export default Auth;
