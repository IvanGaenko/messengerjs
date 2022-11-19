import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth.slice';
import userSlice from './slices/user.slice';

const reducer = {
  auth: authSlice,
  user: userSlice,
};

export const store = configureStore({
  reducer: reducer,
});
