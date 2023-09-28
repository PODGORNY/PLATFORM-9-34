import { createSlice } from '@reduxjs/toolkit';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    status: 'loading',
    location: 'articles-list',
    home: false,
    submitActive: true,
    goTo: '',
  },
  reducers: {
    setGoTo(state, action) {
      state.goTo = action.payload;
    },
    setSubmit(state, action) {
      state.submitActive = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    goHome(state, action) {
      state.home = action.payload;
    },
  },
});

export default statusSlice.reducer;
export const { setStatus, setLocation, goHome, setSubmit, setGoTo } = statusSlice.actions;
