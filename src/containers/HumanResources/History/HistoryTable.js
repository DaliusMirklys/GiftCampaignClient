import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import { IconButton } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { materialStyles } from '../../../utils/styles/materialStyles';
import { PictureAsPdf } from '@material-ui/icons';


const HistoryTable = props => {
  const classes = materialStyles();
  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="center" id="DisplayNone650">Status</TableCell>
            <TableCell align="center">
              Rating
            </TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.history?.map(gift => (
            <Row
              key={gift.id}
              gift={gift}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Row = props => {
  const classes = materialStyles();
  const { gift } = props;
  const [open, setOpen] = React.useState(false);
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
          {gift.boxTitle}
        </TableCell>
        <TableCell component="th" scope="row" align="center" id="DisplayNone650">
          {gift.status}
        </TableCell>
        <TableCell align="center" style={{ verticalAlign: 'bottom' }}>
            {gift.rating ? (
              <Rating
                name={gift.id.toString()}
                precision={0.5}
                value={gift.rating / 2}
                readOnly
              />
            ) : (
              'Not rated yet'
            )}
        </TableCell>
        <TableCell align="right">
            <IconButton
              size="small"
            >
              <PictureAsPdf />
            </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="p" gutterBottom component="div">
                Name: {gift.recipient.name}
              </Typography>
              <Typography variant="p" gutterBottom component="div">
                Address: {gift.recipient.address}
              </Typography>
              <Typography variant="p" gutterBottom component="div">
                Email: {gift.recipient.email}
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
                  {gift.items.map(item => (
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
                    <TableCell align="right">{gift.totalPrice}</TableCell>
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

export default HistoryTable;
