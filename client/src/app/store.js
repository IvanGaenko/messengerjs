import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth.slice';
import userSlice from './slices/user.slice';
import chatSlice from './slices/chat.slice';

const reducer = {
  auth: authSlice,
  user: userSlice,
  chat: chatSlice,
};

export const store = configureStore({
  reducer: reducer,
});
