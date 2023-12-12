import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    changeMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { changeMessages } = chatSlice.actions;

export default chatSlice.reducer;
