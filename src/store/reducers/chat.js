import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  replyMessage: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    changeMessages: (state, action) => {
      state.messages = action.payload;
    },
    setReplyMessage: (state, action) => {
      state.replyMessage = action.payload;
    },
  },
});

export const { changeMessages, setReplyMessage } = chatSlice.actions;

export default chatSlice.reducer;
