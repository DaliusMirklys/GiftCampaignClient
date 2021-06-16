import { makeStyles } from '@material-ui/core/styles';

export const materialStyles = makeStyles({
  // shared
  table: {
    width: '90%',
    margin: 'auto',
    minWidth: 300,
  },
  tableRow: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  buttonGroup: {
    padding: 10,
  },
  input: {
    padding: '5px 14px',
    minWidth: 100,
    maxWidth: 150,
  },
  inputBox: {
    width: '100%',
    height: '100%',
    marginBottom: 7,
  },
  // one-off
  createGiftBox: {
    width: '90%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconButtonsBox: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  newIcon: {
    color: 'rgb(255, 238, 0)',
    fontSize: 36,
    background: '#444',
    borderRadius: 6,
  },
  snackbar: {
    position: 'relative',
    top: 10,
  },
});
