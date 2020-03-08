// App Imports
import { START_TYPING, STOP_TYPING } from '../types/typingTypes';

// Actions

export function startTyping(data) {
  return async dispatch => {
    dispatch({
      type: START_TYPING,
      typingStatus: true,
      user: data.user,
    });
  };
}

export function stopTyping(data) {
  return async dispatch => {
    dispatch({
      type: STOP_TYPING,
      typingStatus: false,
      user: data.user,
    });
  };
}
