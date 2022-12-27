import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  accessTokenExpDate: null,
  message: '',
  sessionError: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      const {
        accessToken,
        accessTokenExpDate,
        message = '',
        sessionError = false,
      } = action.payload;
      state.accessToken = accessToken || '';
      state.accessTokenExpDate = accessTokenExpDate || null;
      state.message = message;
      state.sessionError = sessionError;
      // console.log('action.payload', action.payload);
    },
  },
});

const { actions, reducer } = authSlice;
export const { setToken } = actions;

export default reducer;
