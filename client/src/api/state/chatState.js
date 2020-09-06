// App Imports
import {
  GET_CHAT_LIST,
  GET_CHAT_LIST_REQUEST,
  GET_CHAT_LIST_RESPONSE,
  GET_ROOM,
  GET_ROOM_REQUEST,
  GET_ROOM_RESPONSE,
  GET_MESSAGES,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_RESPONSE,
  SET_CONNECTION,
  CLEAR_MESSAGES,
  CLEAR_UNREAD,
  SET_UNREAD,
  GET_NEW_MESSAGES,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
} from '../types/chatTypes';

// Initial State

export const chatInitialState = {
  isLoading: false,
  isRoomLoading: false,
  isMessageLoading: false,
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

    case GET_ROOM_REQUEST:
      return {
        ...state,
        error: null,
        isRoomLoading: action.isRoomLoading,
      };

    case GET_ROOM_RESPONSE:
      return {
        ...state,
        error: action.error,
        isRoomLoading: false,
      };

    case GET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };

    case GET_MESSAGES_REQUEST:
      return {
        ...state,
        error: null,
        isMessageLoading: action.isMessageLoading,
      };

    case GET_MESSAGES_RESPONSE:
      return {
        ...state,
        error: action.error,
        isMessageLoading: false,
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

    case EDIT_MESSAGE:
      const newOldMessages = state.rooms.map(r => {
        if (r.chatId === action.chatId) {
          return {
            ...r,
            oldMessages: r.oldMessages.map(m => {
              if (m.id === action.editedMessage.messageId) {
                return { ...m, message: action.editedMessage.message };
              }
              return m;
            }),
          };
        }
        return r;
      });

      const newRoomOldMessages = state.room;
      if (state.room.length !== 0 && state.room.oldMessages !== undefined) {
        newRoomOldMessages.oldMessages = state.room.oldMessages.map(r => {
          if (r.id === action.editedMessage.messageId) {
            return { ...r, message: action.editedMessage.message };
          }
          return r;
        });
      } else {
        newRoomOldMessages.oldMessages = [];
      }

      return {
        ...state,
        rooms: state.rooms.length === 0 ? state.rooms : newOldMessages,
        room: newRoomOldMessages,
        messages: state.messages.map(m => {
          if (m.id === action.editedMessage.messageId) {
            return { ...m, message: action.editedMessage.message };
          }
          return m;
        }),
      };

    case DELETE_MESSAGE:
      const deleteOldMessages = state.rooms.map(r => {
        if (r.chatId === action.chatId) {
          return {
            ...r,
            oldMessages: r.oldMessages.filter(
              m => m.id !== action.deletedMessage.messageId,
            ),
          };
        }
        return r;
      });

      const deleteRoomOldMessages = state.room;
      if (state.room.length !== 0 && state.room.oldMessages !== undefined) {
        deleteRoomOldMessages.oldMessages = state.room.oldMessages.filter(
          m => m.id !== action.deletedMessage.messageId,
        );
      } else {
        deleteRoomOldMessages.oldMessages = [];
      }
      return {
        ...state,
        rooms: state.rooms.length === 0 ? state.rooms : deleteOldMessages,
        room: deleteRoomOldMessages,
        messages: state.messages.filter(
          m => m.id !== action.deletedMessage.messageId,
        ),
      };

    default:
      return state;
  }
};
