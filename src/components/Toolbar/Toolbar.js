import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reduxStore/actions';

const Toolbar = props => {
  const name = useSelector(state => state.userData.name);
  const dispatch = useDispatch();
  return (
    <div className="Toolbar">
      <h5>Hi, {name}</h5>
      <Button onClick={() => dispatch(logout())}>Logout</Button>
    </div>
  );
};
export default Toolbar;
