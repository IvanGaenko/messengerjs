// Imports
import isEmpty from 'lodash/isEmpty';

// App Imports
import {
  SET_USER,
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  LOGOUT,
  ADD_FRIEND,
} from '../types/authTypes';

// Initial State

export const authInitialState = {
  error: null,
  isLoading: false,
  isAuthenticated: false,
  details: null,
};

// State

export default (state = authInitialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        // isAuthenticated: !isEmpty(action.user),
        isAuthenticated: !!action.user.id,
        details: action.user,
      };

    case LOGIN_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: action.isLoading,
      };

    case LOGIN_RESPONSE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case LOGOUT:
      return authInitialState;

    case ADD_FRIEND:
      const getNewDetails = state.details;
      getNewDetails.friendList = action.friendList;
      return {
        ...state,
        details: getNewDetails,
      };

    default:
      return state;
  }
};
