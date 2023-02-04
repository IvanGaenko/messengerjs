import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatList: {},
  activeChat: null,
  searchMessagesData: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatList: (state, action) => {
      state.chatList = action.payload;
      state.activeChat = null;
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
        state.activeChat?.user[0].id === action.payload.id
      ) {
        state.activeChat.user[0].isOnline = action.payload.online;
        if (action.payload.online !== true) {
          state.activeChat.user[0].lastActivity = action.payload.lastActivity;
        }
      }
      console.log(
        'chat list before toggle online iteration',
        state.chatList.conversations,
      );
      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.user[0].id === action.payload.id) {
          console.log('finded chat for online status', chat.user[0].isOnline);
          chat.user[0].isOnline = action.payload.online;
          chat.user[0].lastActivity = action.payload.lastActivity;
          return;
        }
      }
    },
    updateFriendData: (state, action) => {
      if (
        state.activeChat !== null &&
        state.activeChat?.user[0].id === action.payload.id
      ) {
        state.activeChat.user[0].username =
          action.payload.username ?? state.activeChat.user[0].username;
        state.activeChat.user[0].email =
          action.payload.email ?? state.activeChat.user[0].email;
      }

      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.user[0].id === action.payload.id) {
          chat.user[0].username =
            action.payload.username ?? chat.user[0].username;
          chat.user[0].email = action.payload.email ?? chat.user[0].email;
          return;
        }
      }
    },
    addMessage: (state, action) => {
      console.log('action.payload message', action.payload);
      if (
        state.activeChat !== null &&
        action.payload.message.conversationId === state.activeChat?.id
      ) {
        state.activeChat.isTyping = false;
        state.activeChat.messages.push(action.payload.message);

        if (action.payload.message.userId !== state.chatList.id) {
          state.activeChat.unreadedMessagesCount++;
          console.log(
            '+++++++++++++++++++++++++++ unreadedMessagesCount activeChat added',
            state.activeChat.unreadedMessagesCount,
          );
        }
      }

      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.id === action.payload.message.conversationId) {
          chat.isTyping = false;
          chat.messages.push(action.payload.message);
          chat.lastUpdated = action.payload.lastUpdated;

          if (action.payload.message.userId !== state.chatList.id) {
            chat.unreadedMessagesCount++;
            console.log(
              '+++++++++++++++++++++++++++unreadedMessagesCount chatList added',
              chat.unreadedMessagesCount,
            );
          }

          state.chatList.conversations.sort((a, b) => {
            return new Date(b.lastUpdated) - new Date(a.lastUpdated);
          });
          return;
        }
      }
    },
    typingStatus: (state, action) => {
      console.log('typingStatus', action.payload);
      if (
        state.activeChat !== null &&
        state.activeChat.id === action.payload.conversationId
      ) {
        state.activeChat.isTyping = action.payload.isTyping;
      }

      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.id === action.payload.conversationId) {
          chat.isTyping = action.payload.isTyping;
          return;
        }
      }
    },
    updateReceiptStatus: (state, action) => {
      console.log('updateReceiptStatus', action.payload);
      const { readReceiptIds, conversationId } = action.payload;
      const currentConversationIndex = state.chatList.conversations.findIndex(
        (conversation) => conversation.id === conversationId,
      );
      console.log('readReceiptIds', readReceiptIds);

      for (let i = 0; i < readReceiptIds.length; i++) {
        const findedMessageIndex = state.chatList.conversations[
          currentConversationIndex
        ].messages.findIndex((message) => message.id === readReceiptIds[i]);

        if (findedMessageIndex !== -1) {
          // for active chat
          if (
            state.activeChat !== null &&
            state.activeChat?.id === conversationId
          ) {
            state.activeChat.messages[findedMessageIndex].haveSeen = true;

            if (action.payload.friendId !== state.chatList.id) {
              state.activeChat.unreadedMessagesCount--;
              console.log(
                '------------------------------unreadedMessagesCount activeChat removed',
                state.activeChat.unreadedMessagesCount,
              );
            }
          }

          state.chatList.conversations[currentConversationIndex].messages[
            findedMessageIndex
          ].haveSeen = true;

          if (action.payload.friendId !== state.chatList.id) {
            state.chatList.conversations[currentConversationIndex]
              .unreadedMessagesCount--;
            console.log(
              '---------------------------------unreadedMessagesCount chatList removed',
              state.chatList.conversations[currentConversationIndex]
                .unreadedMessagesCount,
            );
          }
        }
      }
    },
    searchMessages: (state, action) => {
      state.searchMessagesData = action.payload;
    },
  },
});

const { reducer } = chatSlice;
export const {
  setChatList,
  setActiveChat,
  toggleFriendOnline,
  updateFriendData,
  addMessage,
  typingStatus,
  updateReceiptStatus,
  searchMessages,
} = chatSlice.actions;

export default reducer;
