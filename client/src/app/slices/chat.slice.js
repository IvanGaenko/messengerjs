import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatList: [],
  activeChat: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatList: (state, action) => {
      state.chatList = action.payload;
      console.log('setChatList payload', action.payload);
    },
    setActiveChat: (state, action) => {
      if (action.payload === null) {
        state.activeChat = null;
        return;
      }
      state.activeChat = state.chatList.conversations.find(
        (chat) => chat.id === action.payload,
      );
      console.log('setActiveChat payload', action.payload);
    },
    toggleFriendOnline: (state, action) => {
      console.log('toggleFriendOnline payload', action.payload);
      if (
        state.activeChat !== null &&
        state.activeChat?.users[0].id === action.payload.id
      ) {
        state.activeChat.users[0].isOnline = action.payload.online;
        if (action.payload.online !== true) {
          state.activeChat.users[0].lastActivity = action.payload.lastActivity;
        }
      }
      console.log(
        'chat list before toggle online iteration',
        state.chatList.conversations,
      );
      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.users[0].id === action.payload.id) {
          console.log('finded chat for online status', chat.users[0].isOnline);
          chat.users[0].isOnline = action.payload.online;
          chat.users[0].lastActivity = action.payload.lastActivity;
          return;
        }
      }
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getCurrent.fulfilled, (state, action) => {
  //     const { id, username, email } = action.payload;
  //     state.id = id;
  //     state.username = username;
  //     state.email = email;
  //   });
  //   builder.addCase(getCurrent.rejected, (state) => {
  //     state.id = null;
  //     state.username = '';
  //     state.email = '';
  //   });
  // },
});

const { reducer } = chatSlice;
export const { setChatList, setActiveChat, toggleFriendOnline } =
  chatSlice.actions;

export default reducer;
