import React from 'react';
import GiftItemList from './GiftItems/GiftItems';
import GiftBoxes from './GiftBoxes/GiftBoxes';
import Overview from './Overview/Overview';
import History from './History/History';

const HumanResources = () => (
  <React.Fragment>
    <Overview />
    <GiftItemList />
    <GiftBoxes />
    <History />
  </React.Fragment>
);

export default HumanResources;
