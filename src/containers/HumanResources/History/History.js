import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HistoryTable from './HistoryTable';
import { socket } from '../../../utils/socket/socket';
import { fetchHistory } from '../../../reduxStore/actions';

const History = () => {
  const history = useSelector(state => state.history);
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on('giftDelivered', () => dispatch(fetchHistory()));
    socket.on('giftRated', () => dispatch(fetchHistory()));
    dispatch(fetchHistory());
  }, []);

  return (
    <div className="ContentBox">
      <h5>History</h5>
      <HistoryTable history={history} />
    </div>
  );
};

export default History;
