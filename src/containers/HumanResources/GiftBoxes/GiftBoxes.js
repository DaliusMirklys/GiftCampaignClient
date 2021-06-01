import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import GiftBoxTable from './GiftBoxTable';
import SendGiftModal from './SendGiftModal';
import CreateGiftBoxModal from './CreateGiftBoxModal';
import { useSelector } from 'react-redux';
import { socket } from '../../../utils/socket/socket';

const GiftBoxes = () => {
  const [showCreateGiftBoxModal, setShowCreateGiftBoxModal] = useState(false);
  const [showSendGiftModal, setShowSendGiftModal] = useState(false);
  const [giftBoxToSend, setGiftBoxToSend] = useState(null);
  const [giftBoxes, setGiftBoxes] = useState(null);
  const giftItems = useSelector(state => state.giftItems);
  const token = useSelector(state => state.userData.token);
  socket.on('giftBoxesChanged', () => fetchGiftBoxes());

  const fetchGiftBoxes = async () => {
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/getGiftBoxes', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      setGiftBoxes(response);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchGiftBoxes();
  }, [giftItems]);

  return (
    <div className="ContentBox">
      <h5>Gift boxes</h5>
      <GiftBoxTable
        giftBoxes={giftBoxes}
        fetchGiftBoxes={fetchGiftBoxes}
        setShowSendGiftModal={setShowSendGiftModal}
        setGiftBoxToSend={setGiftBoxToSend}
      />
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={() => setShowCreateGiftBoxModal(true)}
      >
        Create gift box
      </Button>
      {showCreateGiftBoxModal ? (
        <CreateGiftBoxModal
          close={() => setShowCreateGiftBoxModal(false)}
          giftItems={giftItems}
          fetchGiftBoxes={fetchGiftBoxes}
        />
      ) : null}
      {showSendGiftModal ? (
        <SendGiftModal
          close={() => setShowSendGiftModal(false)}
          giftBox={giftBoxToSend}
        />
      ) : null}
    </div>
  );
};

export default GiftBoxes;
