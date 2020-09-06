// Imports
import axios from 'axios';

// App Imports
import { API_URL } from '../../setup/config/env';
import {
  GET_CHAT_LIST,
  GET_ROOM,
  GET_MESSAGES,
  SET_CONNECTION,
  CLEAR_UNREAD,
  SET_UNREAD,
  GET_NEW_MESSAGES,
  GET_CHAT_LIST_REQUEST,
  GET_CHAT_LIST_RESPONSE,
  GET_ROOM_REQUEST,
  GET_ROOM_RESPONSE,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_RESPONSE,
} from '../types/chatTypes';
import { socketEmit } from '../../setup/socket';
import { CHAT_LIST_CACHE, CHAT_ROOM_CACHE, MESSAGE_CACHE } from './cache-keys';

// Actions
export function getChatRooms(detail, friendList, limit, isLoading = true) {
  return async dispatch => {
    try {
      const chatList = JSON.parse(window.localStorage.getItem(CHAT_LIST_CACHE));

      if (chatList) {
        dispatch({
          type: GET_CHAT_LIST,
          rooms: chatList,
        });
      } else {
        dispatch({
          type: GET_CHAT_LIST_REQUEST,
          isLoading,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_CHAT_LIST_REQUEST,
        isLoading,
      });
    }

    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getAllChatRooms',
        params: { detail, friendList, limit },
      });

      let error = data.message;
      console.log('getAllChatRooms', data);

      if (data.success) {
        const chatList = data.data;
        console.log('-----chatList', chatList);

        dispatch({
          type: GET_CHAT_LIST,
          rooms: chatList,
        });

        window.localStorage.setItem(CHAT_LIST_CACHE, JSON.stringify(chatList));
      } else {
        dispatch({
          type: GET_CHAT_LIST_RESPONSE,
          error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({
        type: GET_CHAT_LIST_RESPONSE,
        isLoading: false,
      });
    }
  };
}

export function getRoom(detail, id, limit, isRoomLoading = true) {
  return async dispatch => {
    try {
      const cachedChatRoom = JSON.parse(
        window.localStorage.getItem(CHAT_ROOM_CACHE),
      );
      console.log('cachedChatRoom', cachedChatRoom);
      console.log(
        'cachedChatRoom.id === id',
        cachedChatRoom.id,
        parseInt(id),
        cachedChatRoom.id === parseInt(id),
      );

      if (cachedChatRoom && cachedChatRoom.id === parseInt(id)) {
        dispatch({
          type: GET_ROOM,
          room: cachedChatRoom,
        });

        dispatch({
          type: SET_CONNECTION,
          connectionData: cachedChatRoom.chatId,
        });

        socketEmit('join', cachedChatRoom.chatId);
        console.log('!!!!!!!!!!!!!!!!getExistRoom');
      } else {
        dispatch({
          type: GET_ROOM_REQUEST,
          isRoomLoading,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_ROOM_REQUEST,
        isRoomLoading,
      });
    }

    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getRoom',
        params: { detail, id, limit },
      });

      let error = data.message;
      console.log('-----------------getRoom', data);

      if (data.success) {
        const chatRoom = data.data[0];
        dispatch({
          type: GET_ROOM,
          room: chatRoom,
        });

        dispatch({
          type: SET_CONNECTION,
          connectionData: chatRoom.chatId,
        });
        console.log('chatRoom to cache', chatRoom);

        window.localStorage.setItem(CHAT_ROOM_CACHE, JSON.stringify(chatRoom));
        socketEmit('join', chatRoom.chatId);
      } else {
        dispatch({
          type: GET_ROOM_RESPONSE,
          error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({
        type: GET_ROOM_RESPONSE,
        isRoomLoading: false,
      });
    }
  };
}

export function getChatRoomMessage(detail, id, limit, isMessageLoading = true) {
  return async dispatch => {
    try {
      const cachedMessages = JSON.parse(
        window.localStorage.getItem(MESSAGE_CACHE),
      );

      if (cachedMessages) {
        dispatch({
          type: GET_MESSAGES_REQUEST,
          isMessageLoading,
        });
        dispatch({
          type: GET_MESSAGES,
          messages: cachedMessages,
        });
      } else {
        dispatch({
          type: GET_MESSAGES_REQUEST,
          isMessageLoading,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_MESSAGES_REQUEST,
        isMessageLoading,
      });
    }

    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getMessage',
        params: { detail, id, limit },
      });

      let error = data.message;
      console.log('getMessage', data);

      if (data.success) {
        const chatMessage = data.data;
        dispatch({
          type: GET_MESSAGES,
          messages: chatMessage,
        });

        window.localStorage.setItem(MESSAGE_CACHE, JSON.stringify(chatMessage));
      } else {
        dispatch({
          type: GET_MESSAGES_RESPONSE,
          error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({
        type: GET_MESSAGES_RESPONSE,
        isMessageLoading: false,
      });
    }
  };
}

export function getNewChatMessages(data) {
  return async dispatch => {
    const cachedChatRoom = JSON.parse(
      window.localStorage.getItem(MESSAGE_CACHE),
    );

    if (cachedChatRoom) {
      window.localStorage.setItem(
        MESSAGE_CACHE,
        JSON.stringify([...cachedChatRoom, data]),
      );
    }

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

export function clearRawMessages(detail, id, name) {
  return async dispatch => {
    // const cachedChatRoom = JSON.parse(
    //   window.localStorage.getItem(CHAT_ROOM_CACHE),
    // );

    try {
      const { data } = await axios.post(API_URL, {
        operation: 'clearRawMessages',
        params: { detail, id, name },
      });

      console.log('clearRawMessages data', data);

      if (data.success) {
        const chatRoom = data.data;

        dispatch({
          type: CLEAR_UNREAD,
          // rawMessages: data.data,
          rawMessages: chatRoom,
        });

        // if (cachedChatRoom) {
        //   const getNewRoom = cachedChatRoom;
        //   getNewRoom.rawMessages = chatRoom;
        //   window.localStorage.setItem(
        //     CHAT_ROOM_CACHE,
        //     JSON.stringify(getNewRoom),
        //   );
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
