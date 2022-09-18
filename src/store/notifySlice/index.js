import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  skipNext: 0,
  length: 0,
};

export const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    addNotify: (state, action) => {
      const parser = [ ...state.value, ...action.payload ];
      state.value = parser
      state.length = parser.length;
    },
    setSkipNext: (state, action) => {
      state.skipNext = action.payload;
    }
  }
});

export const {
  addNotify,
  setSkipNext,
} = notifySlice.actions;

export default notifySlice.reducer;
