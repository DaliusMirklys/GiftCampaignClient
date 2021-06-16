import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  OutlinedInput,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import Modal from '../../../components/ReusableComponents/Modal';
import { validationRules } from '../../../utils/validation/validationRules';
import { materialStyles } from '../../../utils/styles/materialStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useSelector } from 'react-redux';

const CreateGiftBoxModal = props => {
  const classes = materialStyles();
  const [giftBoxTitle, setGiftBoxTitle] = useState({
    value: null,
    isInvalid: false,
  });
  const [itemToAdd, setItemToAdd] = useState({ id: null, title: '' });
  const [itemQuantityToAdd, setItemQuantityToAdd] = useState({
    value: '',
    isInvalid: false,
  });
  const [addedItems, setAddedItems] = useState([]);
  const token = useSelector(state => state.userData.token);
  const addItem = event => {
    if (!itemToAdd.id || addedItems.find(item => item.id === itemToAdd.id))
      return document.getElementById('selectItem').focus();
    if (!itemQuantityToAdd.value || itemQuantityToAdd.isInvalid)
      return document.getElementById('itemQuantityToAdd').focus();
    setAddedItems([
      ...addedItems,
      {
        id: itemToAdd.id,
        title: itemToAdd.title,
        quantity: itemQuantityToAdd.value,
      },
    ]);
    setItemToAdd({ id: null, title: '' });
    setItemQuantityToAdd({ value: '', isInvalid: false });
  };
  const removeItem = event => {
    const index = addedItems.findIndex(
      item => item.id === +event.currentTarget.id
    );
    const updatedAddedItems = [...addedItems];
    updatedAddedItems.splice(index, 1);
    setAddedItems(updatedAddedItems);
  };
  const changeQuantity = (event, value) => {
    const index = addedItems.findIndex(
      item => item.id === +event.currentTarget.id
    );
    const updatedAddedItems = [...addedItems];
    updatedAddedItems[index].quantity =
      +updatedAddedItems[index].quantity + value;
    setAddedItems(updatedAddedItems);
  };
  const addQuantity = event => changeQuantity(event, 1);
  const subtractQuantity = event => changeQuantity(event, -1);
  const createGiftBox = async event => {
    event.preventDefault();
    if (giftBoxTitle.isInvalid || !giftBoxTitle.value)
      return document.getElementById('giftBoxTitle').focus();
    if (!addedItems.length)
      return document.getElementById('selectItem').focus();
    try {
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/createGiftBox',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            giftBoxTitle: giftBoxTitle.value,
            items: addedItems,
          }),
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      props.fetchGiftBoxes();
      props.close();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Modal close={props.close}>
      <h4>Create gift box</h4>
      <form>
        <Box className={classes.inputBox}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Box title"
            label="Box title"
            helperText={
              giftBoxTitle.isInvalid ? giftBoxTitle.isInvalid.message : null
            }
            id="giftBoxTitle"
            error={giftBoxTitle.isInvalid}
            onBlur={event =>
              setGiftBoxTitle({
                ...giftBoxTitle,
                isInvalid: validationRules.title(event.target.value),
              })
            }
            onChange={event =>
              setGiftBoxTitle({
                value: event.target.value,
                isInvalid:
                  validationRules.title(event.target.value) ||
                  giftBoxTitle.isInvalid,
              })
            }
          />
        </Box>
        <Typography>Box content</Typography>
        <Box className={classes.createGiftBox}>
          <Select
            labelId="typesLabel"
            label="Types"
            id="selectItem"
            value={itemToAdd.title}
            input={<OutlinedInput classes={{ input: classes.input }} />}
            onChange={(event, child) =>
              setItemToAdd({ id: child.props.id, title: child.props.value })
            }
          >
            {props.giftItems?.map(item => (
              <MenuItem key={item.id} id={item.id} value={item.title}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
          <Box style={{ width: 50 }}>
            <TextField
              size="small"
              value={itemQuantityToAdd.value}
              id="itemQuantityToAdd"
              error={itemQuantityToAdd.isInvalid}
              onBlur={event =>
                setItemQuantityToAdd({
                  ...itemQuantityToAdd,
                  isInvalid: validationRules.quantity(event.target.value),
                })
              }
              onChange={event =>
                setItemQuantityToAdd({
                  value: event.target.value,
                  isInvalid:
                    validationRules.quantity(event.target.value) ||
                    itemQuantityToAdd.isInvalid,
                })
              }
              placeholder="pcs"
              type="number"
            />
          </Box>
          <Button
            onClick={addItem}
            color="primary"
            variant="contained"
            size="small"
          >
            Add item
          </Button>
        </Box>
      </form>
      <div>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableBody>
            {addedItems?.map(item => (
              <TableRow key={item.id}>
                <TableCell align="center" component="th" scope="row">
                  {item.title}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right" padding="none">
                  <IconButton id={item.id} size="small" onClick={addQuantity}>
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    id={item.id}
                    size="small"
                    onClick={subtractQuantity}
                    disabled={!item.quantity}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton id={item.id} size="small" onClick={removeItem}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ButtonGroup className={classes.buttonGroup}>
        <Button
          onClick={createGiftBox}
          color="primary"
          variant="contained"
          size="small"
        >
          Create box
        </Button>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={() => props.close()}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Modal>
  );
};
export default CreateGiftBoxModal;
