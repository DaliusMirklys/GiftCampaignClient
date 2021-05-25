import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ReusableComponents/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { materialStyles } from '../../../utils/styles/materialStyles';
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  OutlinedInput,
} from '@material-ui/core';
import { fetchOverview, fetchGiftItems } from '../../../reduxStore/actions';
import { useSelector, useDispatch } from 'react-redux';

const deliveryMethods = [
  { title: '1 second', duration: 1 },
  { title: '10 seconds', duration: 10 },
  { title: '1 minute', duration: 60 },
  { title: '10 minutes', duration: 600 },
  { title: '1 hour', duration: 3600 },
  { title: '10 days', duration: 43200 },
];

const SendGiftModal = props => {
  const classes = materialStyles();
  const [employees, setEmployees] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [deliveryDuration, setDeliveryDuration] = useState(null);
  const token = useSelector(state => state.userData.token)
  const dispatch = useDispatch()
  const fetchEmployees = async () => {
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/getEmployees', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      setEmployees(response);
    } catch (error) {
      alert(error);
    }
  };
  const sendGift = async event => {
    event.preventDefault();
    if (!recipientId) return document.getElementById('selectEmployee').focus();
    if (!deliveryDuration)
      return document.getElementById('selectDelivery').focus();
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/sendGift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          giftBoxId: props.giftBox.id,
          recipientId: recipientId,
          deliveryDuration: deliveryDuration,
          message: document.getElementById('addMessage').value,
        }),
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch(fetchOverview())
      dispatch(fetchGiftItems())
      props.close();
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  return (
    <Modal close={props.close}>
      <h4>Send {props.giftBox.title}</h4>
      <form onSubmit={sendGift} style={{ width: 200 }}>
        <Box className={classes.inputBox}>
          <Select
            fullWidth
            labelId="typesLabel"
            label="Types"
            id="selectEmployee"
            input={<OutlinedInput classes={{ input: classes.input }} />}
            onChange={(event, child) => setRecipientId(child.props.id)}
          >
            {employees?.map(employee => (
              <MenuItem
                key={employee.id}
                id={employee.id}
                value={employee.name}
              >
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className={classes.inputBox}>
          <Select
            fullWidth
            margin="dense"
            labelId="typesLabel"
            label="Types"
            id="selectDelivery"
            input={<OutlinedInput classes={{ input: classes.input }} />}
            onChange={(event, child) => setDeliveryDuration(child.props.value)}
          >
            {deliveryMethods?.map(method => (
              <MenuItem key={method.title} value={method.duration}>
                {method.title}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          placeholder="Message"
          id="addMessage"
        />
        <ButtonGroup className={classes.buttonGroup}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="small"
          >
            Send
          </Button>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={props.close}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </Modal>
  );
};
export default SendGiftModal;
