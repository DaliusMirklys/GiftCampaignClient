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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { IconButton } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { FiberNew } from '@material-ui/icons';
import { materialStyles } from '../../utils/styles/materialStyles';
import { useSelector } from 'react-redux';
import { socket } from '../../utils/socket/socket';

const ReceivedGifts = () => {
  const classes = materialStyles();
  const token = useSelector(state => state.userData.token);
  const [receivedGifts, setReceivedGifts] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/rateGift',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            giftId: event.target.name,
            rating: event.target.value * 2,
          }),
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      setOpenSnackbar(true);
    } catch (error) {
      alert(error);
    }
  };
  const openGift = async id => {
    try {
      await fetch('https://gift-campaign.herokuapp.com/openGift/' + id, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    socket.on('giftDelivered', () => fetchReceivedGifts());
    fetchReceivedGifts();
    return socket.removeListener('giftDelivered');
  }, []);
  return (
    <React.Fragment>
      <div className="ContentBox">
        <TableContainer component={Paper} className={classes.table}>
          <Table aria-label="collapsible table" size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell />
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
                <Row
                  key={gift.id}
                  gift={gift}
                  rateGift={rateGift}
                  openGift={openGift}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        className={classes.snackbar}
      >
        <MuiAlert elevation={24} severity="success">
          Gift rating sent
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
};

function Row(props) {
  const { gift } = props;
  const [open, setOpen] = React.useState(false);
  const [giftOpened, setGiftOpened] = React.useState(gift.opened);
  const classes = materialStyles();
  return (
    <React.Fragment>
      <TableRow className={classes.tableRow}>
        <TableCell padding="none">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
              if (!giftOpened) {
                setGiftOpened(true);
                props.openGift(gift.id);
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="none" align="left">
          {!giftOpened && <FiberNew className={classes.newIcon} />}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          align="center"
          id="DisplayNone500"
        >
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
        <TableCell align="center">
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
