// Imports
import axios from 'axios';

// App Imports
import { API_URL } from '../../setup/config/env';
import { EDIT_MESSAGE, DELETE_MESSAGE } from '../types/chatTypes';

export function editChatMessages(messageId, author, message) {
  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'editChatMessage',
        params: { messageId, author, message },
      });

      if (data.success) {
        dispatch({
          type: EDIT_MESSAGE,
          editedMessage: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteChatMessage(messageId, author) {
  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'deleteChatMessage',
        params: { messageId, author },
      });

      if (data.success) {
        dispatch({
          type: DELETE_MESSAGE,
          deletedMessage: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}
