// App Imports
import {
  GET_CHAT_LIST,
  GET_CHAT_LIST_REQUEST,
  GET_CHAT_LIST_RESPONSE,
  GET_ROOM,
  GET_MESSAGES,
  SET_CONNECTION,
  CLEAR_MESSAGES,
  CLEAR_UNREAD,
  SET_UNREAD,
  GET_NEW_MESSAGES,
} from '../types/chatTypes';

// Initial State

export const chatInitialState = {
  isLoading: false,
  error: null,
  rooms: [],
  room: [],
  connectionData: '',
  messages: [],
  rawMessages: [],
};

// State

export default (state = chatInitialState, action) => {
  switch (action.type) {
    case GET_CHAT_LIST:
      return {
        ...state,
        error: null,
        rooms: action.rooms,
      };

    case GET_CHAT_LIST_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: action.isLoading,
      };

    case GET_CHAT_LIST_RESPONSE:
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case GET_ROOM:
      return {
        ...state,
        room: action.room,
      };

    case GET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };

    case SET_CONNECTION:
      return {
        ...state,
        connectionData: action.connectionData,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };

    case CLEAR_UNREAD:
      const getNewRoom = state.room;
      getNewRoom.rawMessages = action.rawMessages;
      return {
        ...state,
        room: getNewRoom,
      };

    case GET_NEW_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.messages],
      };

    case SET_UNREAD:
      const newRoom = state.room;
      newRoom.rawMessages = [...newRoom.rawMessages, action.rawMessages];
      return {
        ...state,
        room: newRoom,
      };

    default:
      return state;
  }
};
