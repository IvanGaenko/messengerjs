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
    },
    setActiveChat: (state, action) => {
      if (action.payload === null) {
        state.activeChat = null;
        return;
      }
      state.activeChat = state.chatList.conversations.find(
        (chat) => chat.id === action.payload,
      );
    },
    toggleFriendOnline: (state, action) => {
      const { id, online, lastActivity } = action.payload;
      if (state.activeChat !== null && state.activeChat?.user[0].id === id) {
        state.activeChat.user[0].isOnline = online;
        if (online !== true) {
          state.activeChat.user[0].lastActivity = lastActivity;
        }
      }

      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.user[0].id === id) {
          chat.user[0].isOnline = online;
          chat.user[0].lastActivity = lastActivity;

          return;
        }
      }
    },
    updateFriendData: (state, action) => {
      const { id } = action.payload;
      if (state.activeChat !== null && state.activeChat?.user[0].id === id) {
        state.activeChat.user[0] = {
          ...state.activeChat.user[0],
          ...action.payload,
        };
      }

      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.user[0].id === id) {
          chat.user[0] = {
            ...chat.user[0],
            ...action.payload,
          };

          return;
        }
      }
    },
    addMessage: (state, action) => {
      console.log('action.payload message', action.payload);
      const { lastUpdated, message } = action.payload;
      const { conversationId, dayId, ...messageData } = message;

      const currentConversationIndex = state.chatList.conversations.findIndex(
        (conversation) => {
          return conversation.id === conversationId;
        },
      );

      const currentMessageByDayIndex = state.chatList.conversations[
        currentConversationIndex
      ].messageByDay.findIndex((byDay) => {
        return byDay.dayId === dayId;
      });

      console.log('currentConversationIndex', currentConversationIndex);
      console.log('currentMessageByDayIndex', currentMessageByDayIndex);

      if (currentMessageByDayIndex === -1) {
        state.chatList.conversations[
          currentConversationIndex
        ].messageByDay.push({
          id: messageData.byDayId,
          dayId,
          conversationId,
          messages: [],
        });

        if (
          state.activeChat !== null &&
          conversationId === state.activeChat?.id
        ) {
          state.activeChat.messageByDay.push({
            id: messageData.byDayId,
            dayId,
            conversationId,
            messages: [],
          });

          console.log('added messageByDay');
        }
      }

      if (
        state.activeChat !== null &&
        conversationId === state.activeChat?.id
      ) {
        state.activeChat.isTyping = false;

        state.activeChat.messageByDay[
          currentMessageByDayIndex === -1
            ? state.activeChat.messageByDay.length - 1
            : currentMessageByDayIndex
        ].messages.push({
          ...messageData,
        });

        if (messageData.userId !== state.chatList.id) {
          state.activeChat.unreadedMessagesCount++;
          console.log(
            '+++++++++++++++++++++++++++ unreadedMessagesCount activeChat added',
            state.activeChat.unreadedMessagesCount,
          );
        }
      }

      state.chatList.conversations[currentConversationIndex].isTyping = false;
      state.chatList.conversations[currentConversationIndex].lastUpdated =
        lastUpdated;
      state.chatList.conversations[currentConversationIndex].messageByDay[
        currentMessageByDayIndex === -1
          ? state.chatList.conversations[currentConversationIndex].messageByDay
              .length - 1
          : currentMessageByDayIndex
      ].messages.push({
        ...messageData,
      });

      state.chatList.conversations.sort((a, b) => {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });

      if (messageData.userId !== state.chatList.id) {
        state.chatList.conversations[currentConversationIndex]
          .unreadedMessagesCount++;
        console.log(
          '+++++++++++++++++++++++++++ unreadedMessagesCount activeChat added',
          state.chatList.conversations[currentConversationIndex]
            .unreadedMessagesCount,
        );
      }
    },
    typingStatus: (state, action) => {
      console.log('typingStatus', action.payload);
      const { conversationId, isTyping } = action.payload;
      if (state.activeChat !== null && state.activeChat.id === conversationId) {
        state.activeChat.isTyping = isTyping;
      }

      for (let i = 0; i < state.chatList.conversations.length; i++) {
        const chat = state.chatList.conversations[i];
        if (chat.id === conversationId) {
          chat.isTyping = isTyping;
          return;
        }
      }
    },
    updateReceiptStatus: (state, action) => {
      console.log('updateReceiptStatus', action.payload);
      const { readReceiptIds, conversationId, friendId } = action.payload;

      const currentConversationIndex = state.chatList.conversations.findIndex(
        (conversation) => {
          return conversation.id === conversationId;
        },
      );
      console.log('readReceiptIds', readReceiptIds);

      for (let i = 0; i < readReceiptIds.length; i++) {
        const { dayId, messageId } = readReceiptIds[i];

        const findedDayIndex = state.chatList.conversations[
          currentConversationIndex
        ].messageByDay.findIndex((byDay) => {
          return byDay.dayId === dayId;
        });

        console.log(
          'findedDayIndex',
          state.chatList.conversations[currentConversationIndex].messageByDay[
            findedDayIndex
          ].messages,
        );
        if (findedDayIndex !== -1) {
          const findedMessageIndex = state.chatList.conversations[
            currentConversationIndex
          ].messageByDay[findedDayIndex].messages.findIndex((message) => {
            return message.id === messageId;
          });

          console.log('findedMessageIndex', findedMessageIndex);

          // for active chat
          if (
            state.activeChat !== null &&
            state.activeChat?.id === conversationId
          ) {
            state.activeChat.messageByDay[findedDayIndex].messages[
              findedMessageIndex
            ].haveSeen = true;

            if (friendId !== state.chatList.id) {
              state.activeChat.unreadedMessagesCount--;
              console.log(
                '------------------------------unreadedMessagesCount activeChat removed',
                state.activeChat.unreadedMessagesCount,
              );
            }
          }

          state.chatList.conversations[currentConversationIndex].messageByDay[
            findedDayIndex
          ].messages[findedMessageIndex].haveSeen = true;

          if (friendId !== state.chatList.id) {
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
