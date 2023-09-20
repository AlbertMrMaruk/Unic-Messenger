import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PusherProvider } from "react-pusher-hoc";
import Pusher from "pusher-js";

const pusherClient = new Pusher({
  apiKey: "f6bfd10812a202b8d89b",
  cluster: "eu",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PusherProvider value={pusherClient}>
      <App />
    </PusherProvider>
  </React.StrictMode>
);
