import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HistoryTable from './HistoryTable';
import { socket } from '../../../utils/socket/socket';

const History = () => {
  const [history, setHistory] = useState(null);
  const token = useSelector(state => state.userData.token);
  socket.on('giftDelivered', () => fetchHistory());
  const fetchHistory = async () => {
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/getHistory', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      setHistory(response);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="ContentBox">
      <h5>History</h5>
      <HistoryTable
        history={history}
      />
    </div>
  );
};

export default History
