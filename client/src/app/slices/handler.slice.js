import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenAddUserModal: false,
  isOpenFriendProfile: false,
};

const handlerSlice = createSlice({
  name: 'handler',
  initialState,
  reducers: {
    setAddUserModal: (state, action) => {
      state.isOpenAddUserModal = action.payload;
      console.log('state.isOpenAddUserModal', state.isOpenAddUserModal);
    },
    toggleFriendProfile: (state, action) => {
      state.isOpenFriendProfile = action.payload;
    },
  },
});

const { reducer } = handlerSlice;
export const { setAddUserModal, toggleFriendProfile } = handlerSlice.actions;

export default reducer;
