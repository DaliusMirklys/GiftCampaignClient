import React, { useEffect } from 'react';
import OverviewItem from './OverviewItem';
import { fetchOverview } from '../../../reduxStore/actions';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../utils/socket/socket';

const Overview = () => {
  const gifts = useSelector(state => state.overview)
  const dispatch = useDispatch()
  socket.on('giftDelivered', () => dispatch(fetchOverview()));
  socket.on('giftRated', () => dispatch(fetchOverview()));
  useEffect(() => {
    dispatch(fetchOverview());
  }, []);

  return (
    <div className="ContentBox Overview">
        <OverviewItem title="Gifts sent" value={gifts?.sent}></OverviewItem>
        <OverviewItem
          title="Gifts in delivery"
          value={gifts?.inDelivery}
        ></OverviewItem>
        <OverviewItem
          title="Gifts delivered"
          value={gifts?.delivered}
        ></OverviewItem>
        <OverviewItem
          title="Average rating"
          value={gifts?.avgRating}
        ></OverviewItem>
    </div>
  );
};
export default Overview;
