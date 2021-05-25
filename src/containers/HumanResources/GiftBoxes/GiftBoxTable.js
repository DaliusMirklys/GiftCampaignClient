import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Rating } from '@material-ui/lab';
import { materialStyles } from '../../../utils/styles/materialStyles';
import { useSelector } from 'react-redux';

const GiftBoxTable = props => {
  const classes = materialStyles();
  const token = useSelector(state => state.userData.token)
  const deleteGiftBox = async boxId => {
    try {
      await fetch('https://gift-campaign.herokuapp.com/deleteGiftBox/' + boxId, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      props.fetchGiftBoxes();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="center" id="DisplayNone500">
              Average rating
            </TableCell>
            <TableCell align="center" id="DisplayNone650">
              Availability
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.giftBoxes?.map(giftBox => (
            <Row
              key={giftBox.id}
              giftBox={giftBox}
              setShowSendGiftModal={props.setShowSendGiftModal}
              setGiftBoxToSend={props.setGiftBoxToSend}
              deleteGiftBox={deleteGiftBox}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Row = props => {
  const { giftBox } = props;
  const [open, setOpen] = React.useState(false);
  const classes = materialStyles();

  const openSendGiftModal = () => {
    props.setShowSendGiftModal(true);
    props.setGiftBoxToSend(giftBox);
  };
  return (
    <React.Fragment>
      <TableRow className={classes.tableRow}>
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {giftBox.title}
        </TableCell>
        <TableCell align="center">
          <Box
            component="fieldset"
            borderColor="transparent"
            id="DisplayNone500"
          >
            {giftBox.avgRating ? (
              <Rating
                name={giftBox.id.toString()}
                precision={0.5}
                value={giftBox.avgRating / 2}
                readOnly
              />
            ) : (
              'No ratings yet'
            )}
          </Box>
        </TableCell>
        <TableCell align="center" id="DisplayNone650">
          {giftBox.enoughItemsInStock
            ? 'Available'
            : 'Not enough items in stock'}
        </TableCell>
        <TableCell align="right">
          <div style={{ minWidth: 100 }}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              disabled={!giftBox.enoughItemsInStock}
              onClick={openSendGiftModal}
            >
              Send
            </Button>
            <IconButton
              size="small"
              onClick={() => props.deleteGiftBox(giftBox.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {giftBox.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.title}
                      </TableCell>
                      <TableCell align="center">{item.price}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {Math.round(item.quantity * item.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={3} />
                    <TableCell colSpan={2}></TableCell>
                    <TableCell align="right">{giftBox.totalPrice}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default GiftBoxTable;
