import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  replyMessage: "",
  chats: [],
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
    setChats: {
      reducer: (state, action) => {
        state.chats = action.payload;
      },
      prepare: (chats) => {
        return {
          payload:
            chats.sort((chat1, chat2) => {
              const chat1time =
                +chat1?.lastMessage?.timestamp ||
                +(chat1?.lastMessage?.payload?.timestamp + "000");
              const chat2time =
                +chat2?.lastMessage?.timestamp ||
                +(chat2?.lastMessage?.payload?.timestamp + "000");

              return chat1time > chat2time ? -1 : 1;
            }) ?? [],
        };
      },
    },
  },
});

export const { changeMessages, setReplyMessage, setChats } = chatSlice.actions;

export default chatSlice.reducer;
