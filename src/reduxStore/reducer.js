import * as actionTypes from './actionTypes';

const initialState = {
  userData: {
    token: null,
    userName: null,
    userRole: null,
  },
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT:
      return {
        ...state,
        userData: {
          token: null,
          name: null,
          role: null,
        },
      };
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        userData: {
          token: action.data.token,
          name: action.data.name,
          role: action.data.role,
        },
      };

    case actionTypes.SET_GIFT_ITEMS:
      return {
        ...state,
        giftItems: action.data,
      };
    case actionTypes.SET_OVERVIEW:
      return {
        ...state,
        overview: action.data,
      };
    case actionTypes.SET_HISTORY:
      return {
        ...state,
        history: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
