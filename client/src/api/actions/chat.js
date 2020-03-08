// Imports
import axios from 'axios';

// App Imports
import { API_URL } from '../../setup/config/env';
import {
  GET_CHAT_LIST,
  GET_ROOM,
  GET_MESSAGES,
  SET_CONNECTION,
  CLEAR_MESSAGES,
  CLEAR_UNREAD,
  SET_UNREAD,
  GET_NEW_MESSAGES,
} from '../types/chatTypes';
import { socketEmit } from '../../setup/socket';

// Actions
export function getChatRooms(detail, friendList) {
  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getAllChatRooms',
        params: { detail, friendList },
      });

      console.log('getAllChatRooms', data);
      if (data.success) {
        dispatch({
          type: GET_CHAT_LIST,
          rooms: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getRoom(detail, id, rooms) {
  if (rooms.length !== 0) {
    const getExistRoom = rooms.filter(r => r.id === Number(id));
    console.log('getExistRoom', getExistRoom);
    return async dispatch => {
      try {
        dispatch({
          type: GET_ROOM,
          room: getExistRoom[0],
        });

        dispatch({
          type: SET_CONNECTION,
          connectionData: getExistRoom[0].chatId,
        });

        socketEmit('join', getExistRoom[0].chatId);
      } catch (error) {
        console.log(error);
      }
    };
  }

  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getRoom',
        params: { detail, id },
      });

      if (data.success) {
        console.log('-----------------getRoom', data);
        dispatch({
          type: GET_ROOM,
          room: data.data[0],
        });

        dispatch({
          type: SET_CONNECTION,
          connectionData: data.data[0].getChatId,
        });
      }
      socketEmit('join', data.data[0].getChatId);
    } catch (error) {
      console.log(error);
    }
  };
}

export function getChatRoomMessage(detail, id, rooms) {
  if (rooms.length !== 0) {
    const getExistMessages = rooms.filter(r => r.id === Number(id));
    console.log('getExistMessages', getExistMessages);

    return async dispatch => {
      dispatch({
        type: GET_MESSAGES,
        messages: getExistMessages[0].oldMessages,
      });
    };
  }

  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getMessage',
        params: { detail, id },
      });
      console.log('getMessage', data);

      if (data.success) {
        dispatch({
          type: GET_MESSAGES,
          messages: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getNewChatMessages(data) {
  return async dispatch => {
    dispatch({
      type: GET_NEW_MESSAGES,
      messages: data,
    });

    dispatch({
      type: SET_UNREAD,
      rawMessages: data,
    });
  };
}

export function clearChatMessages() {
  return async dispatch => {
    dispatch({
      type: CLEAR_MESSAGES,
      messages: [],
    });
  };
}

export function clearRawMessages(detail, id, name) {
  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'clearRawMessages',
        params: { detail, id, name },
      });
      console.log('clearRawMessages data', data);

      if (data.success) {
        dispatch({
          type: CLEAR_UNREAD,
          rawMessages: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}
