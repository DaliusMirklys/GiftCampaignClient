import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { IconButton } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { materialStyles } from '../../utils/styles/materialStyles';
import { useSelector } from 'react-redux';
import { socket } from '../../utils/socket/socket';

const ReceivedGifts = () => {
  const classes = materialStyles();
  const token = useSelector(state => state.userData.token);
  const [receivedGifts, setReceivedGifts] = useState(null);
  socket.on('giftDelivered', () => fetchReceivedGifts());

  const fetchReceivedGifts = async () => {
    try {
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/getReceivedGifts',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      setReceivedGifts(response);
    } catch (error) {
      alert(error);
    }
  };
  const rateGift = async event => {
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/rateGift', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          giftId: event.target.name,
          rating: event.target.value * 2,
        }),
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchReceivedGifts();
  }, []);
  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="center" id="DisplayNone500">
              Date received
            </TableCell>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center" id="DisplayNone650">
              Message
            </TableCell>
            <TableCell align="center">Rate gift</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {receivedGifts?.map(gift => (
            <Row key={gift.id} gift={gift} rateGift={rateGift} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function Row(props) {
  const { gift } = props;
  const [open, setOpen] = React.useState(false);
  const classes = materialStyles();
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
        <TableCell component="th" scope="row" align="left" id="DisplayNone500">
          {gift.receivedDate}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {gift.boxTitle}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          align="center"
          id="DisplayNone650"
        >
          {gift.message}
        </TableCell>
        <TableCell align="right">
          <Box component="fieldset" borderColor="transparent">
            <Rating
              name={gift.id.toString()}
              precision={0.5}
              defaultValue={gift.rating / 2}
              onChange={props.rateGift}
            />
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Item</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gift.items.map(item => (
                  <TableRow key={item.title}>
                    <TableCell component="th" scope="row" align="center">
                      {item.title}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default ReceivedGifts;
