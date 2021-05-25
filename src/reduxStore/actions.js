import {
  LOGOUT,
  SET_GIFT_ITEMS,
  SET_OVERVIEW,
  SET_USER_DATA,
} from './actionTypes';

const setGiftItems = data => {
  return {
    type: SET_GIFT_ITEMS,
    data: data,
  };
};
const setOverview = data => {
  return {
    type: SET_OVERVIEW,
    data: data,
  };
};
const setUserData = data => {
  return {
    type: SET_USER_DATA,
    data: data,
  };
};
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('role');
  localStorage.removeItem('expirationDate');
  return {
    type: LOGOUT,
  };
};
export const setAuthTimeout = expiresIn => {
  return async dispatch => {
    setTimeout(() => dispatch(logout()), expiresIn * 1000);
  };
};
export const checkAuthAfterRefresh = () => {
  return dispatch => {
    const timeRemainingLogedIn =
      (new Date(localStorage.getItem('expirationDate')).getTime() -
        new Date().getTime()) /
      1000;
    if (timeRemainingLogedIn > 0) {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      if (role !== 'human_resources' && role !== 'employee') dispatch(logout());
      dispatch(setUserData({ data: { token, name, role } }));
      dispatch(setAuthTimeout(timeRemainingLogedIn));
    }
  };
};
export const fetchGiftItems = () => {
  return async dispatch => {
    try {
      const jsonResponse = await fetch('https://gift-campaign.herokuapp.com/getGiftItems', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch(setGiftItems(response));
    } catch (error) {
      alert(error);
    }
  };
};
export const fetchOverview = () => {
  return async dispatch => {
    try {
      const jsonResponse = await fetch(
        'https://gift-campaign.herokuapp.com/getGiftsOverview',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      const response = await jsonResponse.json();
      if (!jsonResponse.ok) throw new Error(response.message);
      dispatch(setOverview(response.gifts));
    } catch (error) {
      alert(error);
    }
  };
};
