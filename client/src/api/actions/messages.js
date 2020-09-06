// Imports
import axios from 'axios';

// App Imports
import { API_URL } from '../../setup/config/env';
import {
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  GET_MORE_MESSAGES,
} from '../types/chatTypes';
import { CHAT_LIST_CACHE, CHAT_ROOM_CACHE, MESSAGE_CACHE } from './cache-keys';

export function editChatMessages(messageId, author, message, chatId) {
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
          chatId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteChatMessage(messageId, author, chatId) {
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
          chatId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function updateClientMessages(data) {
  console.log('updateClientMessages data', data);
  return async dispatch => {
    if (data.status === 'update') {
      console.log('yo');
      editMessageInCache(data);

      dispatch({
        type: EDIT_MESSAGE,
        editedMessage: data,
      });
    }
    if (data.status === 'delete') {
      deleteMessageInCache(data);

      dispatch({
        type: DELETE_MESSAGE,
        deletedMessage: data,
      });
    }
  };
}

export function getMoreMessages(detail, id, limit) {
  return async dispatch => {
    try {
      const { data } = await axios.post(API_URL, {
        operation: 'getMessage',
        params: { detail, id, limit },
      });
      console.log('getMoreMessages', data);

      if (data.success) {
        dispatch({
          type: GET_MORE_MESSAGES,
          messages: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function editMessageInCache(data) {
  const chatList = JSON.parse(window.localStorage.getItem(CHAT_LIST_CACHE));
  const newOldMessages = chatList.map(r => {
    if (r.chatId === data.chatId) {
      return {
        ...r,
        oldMessages: r.oldMessages.map(m => {
          if (m.id === data.messageId) {
            return { ...m, message: data.message };
          }
          return m;
        }),
      };
    }
    return r;
  });

  const cachedChatRoom = JSON.parse(
    window.localStorage.getItem(CHAT_ROOM_CACHE),
  );

  const newRoomOldMessages = cachedChatRoom;
  if (cachedChatRoom.length !== 0 && cachedChatRoom.oldMessages !== undefined) {
    newRoomOldMessages.oldMessages = cachedChatRoom.oldMessages.map(r => {
      if (r.id === data.messageId) {
        return { ...r, message: data.message };
      }
      return r;
    });
  } else {
    newRoomOldMessages.oldMessages = [];
  }

  const cachedMessages = JSON.parse(window.localStorage.getItem(MESSAGE_CACHE));

  const chatListToCache = chatList.length === 0 ? chatList : newOldMessages;
  const chatRoomToCache = newRoomOldMessages;
  const messageToCache = cachedMessages.map(m => {
    if (m.id === data.messageId) {
      return { ...m, message: data.message };
    }
    return m;
  });

  window.localStorage.setItem(CHAT_LIST_CACHE, JSON.stringify(chatListToCache));
  window.localStorage.setItem(CHAT_ROOM_CACHE, JSON.stringify(chatRoomToCache));
  window.localStorage.setItem(MESSAGE_CACHE, JSON.stringify(messageToCache));
}

export function deleteMessageInCache(data) {
  // delete oldMessages in chatList
  const chatList = JSON.parse(window.localStorage.getItem(CHAT_LIST_CACHE));
  const deleteOldMessages = chatList.map(r => {
    if (r.chatId === data.chatId) {
      return {
        ...r,
        oldMessages: r.oldMessages.filter(m => m.id !== data.messageId),
      };
    }
    return r;
  });

  // delete oldMessages in room
  const cachedChatRoom = JSON.parse(
    window.localStorage.getItem(CHAT_ROOM_CACHE),
  );

  const deleteRoomOldMessages = cachedChatRoom;
  if (
    deleteRoomOldMessages.length !== 0 &&
    deleteRoomOldMessages.oldMessages !== undefined
  ) {
    deleteRoomOldMessages.oldMessages = deleteRoomOldMessages.oldMessages.filter(
      m => m.id !== data.messageId,
    );
  } else {
    deleteRoomOldMessages.oldMessages = [];
  }

  // delete oldMessages in message
  const cachedMessages = JSON.parse(window.localStorage.getItem(MESSAGE_CACHE));
  const deleteMessageOldMessages = cachedMessages.filter(
    m => m.id !== data.messageId,
  );

  const chatListToCache =
    deleteRoomOldMessages.length === 0
      ? deleteRoomOldMessages
      : deleteOldMessages;
  const chatRoomToCache = deleteRoomOldMessages;
  const messageToCache =
    deleteMessageOldMessages === 0 ? [] : deleteMessageOldMessages;

  window.localStorage.setItem(CHAT_LIST_CACHE, JSON.stringify(chatListToCache));
  window.localStorage.setItem(CHAT_ROOM_CACHE, JSON.stringify(chatRoomToCache));
  window.localStorage.setItem(MESSAGE_CACHE, JSON.stringify(messageToCache));
}
