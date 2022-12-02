import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from '../services/user.service';

export const getCurrent = createAsyncThunk('user/getCurrent', async () => {
  try {
    const data = await UserService.getCurrent();
    console.log('data', data);
    return data.data;
  } catch (error) {
    return (data.data.message = error.message);
  }
});

const initialState = {
  id: null,
  username: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const { id, username, email } = action.payload;
      state.id = id;
      state.username = username;
      state.email = email;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrent.fulfilled, (state, action) => {
      const { id, username, email } = action.payload;
      state.id = id;
      state.username = username;
      state.email = email;
    });
    builder.addCase(getCurrent.rejected, (state) => {
      state.id = null;
      state.username = '';
      state.email = '';
    });
  },
});

const { reducer } = userSlice;
export const { setCurrentUser } = userSlice.actions;

export default reducer;
