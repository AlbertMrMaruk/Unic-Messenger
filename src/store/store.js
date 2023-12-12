import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chat";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
