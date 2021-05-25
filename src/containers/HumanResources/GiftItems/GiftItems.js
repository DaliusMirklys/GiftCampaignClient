import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Button, ButtonGroup, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import { Input } from '@material-ui/core';
import Modal from '../../../components/ReusableComponents/Modal';
import { validationRules } from '../../../utils/validation/validationRules';
import { materialStyles } from '../../../utils/styles/materialStyles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGiftItems } from '../../../reduxStore/actions';

const GiftItemList = props => {
  const classes = materialStyles();
  const [showCreateGiftItemModal, setShowCreateGiftItemModal] = useState(false);
  const [title, setTitle] = useState({ value: null, isValid: true });
  const [price, setPrice] = useState({ value: null, isValid: true });
  const [quantity, setQuantity] = useState({ value: null, isValid: true });
  const token = useSelector(state => state.userData.token);
  const giftItems = useSelector(state => state.giftItems);
  const dispatch = useDispatch();
  const toggleCreateGiftItemModal = () => {
    if (showCreateGiftItemModal) {
      setTitle({ value: null, isValid: true });
      setPrice({ value: null, isValid: true });
      setQuantity({ value: null, isValid: true });
    }
    setShowCreateGiftItemModal(!showCreateGiftItemModal);
  };
  const createGiftItem = async event => {
    event.preventDefault();
    if (!title.isValid || !title.value)
      return document.getElementById('title').focus();
    if (!price.isValid || !price.value)
      return document.getElementById('price').focus();
    if (!quantity.isValid || !quantity.value)
      return document.getElementById('quantity').focus();
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/createGiftItem', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.value,
          price: price.value,
          quantity: quantity.value,
        }),
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      toggleCreateGiftItemModal();
      dispatch(fetchGiftItems());
    } catch (error) {
      alert(error);
    }
  };
  const deleteGiftItem = async event => {
    try {
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/deleteGiftItem/' + event.currentTarget.id,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch(fetchGiftItems());
    } catch (error) {
      alert(error);
    }
  };
  const addQuantity = async event => {
    try {
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/addQuantity/' + event.currentTarget.id,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch(fetchGiftItems());
    } catch (error) {
      alert(error);
    }
  };
  const subtractQuantity = async event => {
    try {
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/subtractQuantity/' + event.currentTarget.id,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch(fetchGiftItems());
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    dispatch(fetchGiftItems());
  }, []);

  return (
    <div className="ContentBox">
      <h5>Gift items</h5>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">In stock</TableCell>
            <TableCell align="center"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {giftItems?.map(item => (
            <TableRow key={item.id}>
              <TableCell align="center" component="th" scope="row">
                {item.title}
              </TableCell>
              <TableCell align="center">{item.price}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell padding="none">
                <Box className={classes.iconButtonsBox}>
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
                  <IconButton
                    id={item.id}
                    size="small"
                    onClick={deleteGiftItem}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={() => toggleCreateGiftItemModal()}
      >
        Create gift item
      </Button>
      {showCreateGiftItemModal ? (
        <Modal close={() => toggleCreateGiftItemModal()}>
          <h4>Create gift item</h4>
          <form onSubmit={createGiftItem}>
            <Input
              placeholder="Title"
              id="title"
              error={!title.isValid}
              onBlur={event =>
                setTitle({
                  ...title,
                  isValid: validationRules.title(event.target.value),
                })
              }
              onChange={event =>
                setTitle({
                  value: event.target.value,
                  isValid: title.isValid
                    ? true
                    : validationRules.title(event.target.value),
                })
              }
            />
            <Input
              placeholder="Price"
              id="price"
              error={!price.isValid}
              onBlur={event =>
                setPrice({
                  ...price,
                  isValid: validationRules.price(event.target.value),
                })
              }
              onChange={event =>
                setPrice({
                  value: event.target.value,
                  isValid: price.isValid
                    ? true
                    : validationRules.price(event.target.value),
                })
              }
            />
            <Input
              placeholder="Quantity"
              id="quantity"
              error={!quantity.isValid}
              onBlur={event =>
                setQuantity({
                  ...quantity,
                  isValid: validationRules.quantity(event.target.value),
                })
              }
              onChange={event =>
                setQuantity({
                  value: event.target.value,
                  isValid: quantity.isValid
                    ? true
                    : validationRules.quantity(event.target.value),
                })
              }
            />
            <ButtonGroup className={classes.buttonGroup}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="small"
              >
                Create item
              </Button>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={() => toggleCreateGiftItemModal()}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};
export default GiftItemList;
