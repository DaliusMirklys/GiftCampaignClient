import { makeStyles } from '@material-ui/core/styles';

export const materialStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: 10,
    },
  },
  table: {
    width: '90%',
    margin: 'auto',
    minWidth: 300,
    fontSize: 3,
  },
  tableRow: {
    '& > *': {
      borderBottom: 'unset'
    },
  },
  iconButtonsBox: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  buttonGroup: {
    padding: 10,
  },
  createGiftBox: {
    width: '90%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  input: {
    padding: '5px 14px',
    minWidth: 100,
    maxWidth: 150,
  },
  inputBox: {
    width: '100%',
    height: '100%',
    marginBottom: 5,
  },
});
