// App Imports
import { START_TYPING, STOP_TYPING } from '../types/typingTypes';

// Initial State

const initialState = {
  typingStatus: false,
  user: '',
};

// State

export default (state = initialState, action) => {
  switch (action.type) {
    case START_TYPING:
      return {
        typingStatus: true,
        user: action.user,
      };

    case STOP_TYPING:
      return {
        typingStatus: false,
        user: action.user,
      };

    default:
      return state;
  }
};
