import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  accessTokenExpDate: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload.accessToken || '';
      state.accessTokenExpDate = action.payload.accessTokenExpDate || null;
    },
  },
});

const { actions, reducer } = authSlice;
export const { setToken } = actions;

export default reducer;
