import React, { useState } from "react";
// import clickChat from "../api/controlers/ChatsController";
import withPusher from "react-pusher-hoc";
import mapEventsToProps from "../api/controlers/ChatsController";

function Chats() {
  const [text, setText] = useState("");
  return (
    <div className="bg-[#1b1d1f] h-max min-h-[100vh]  pb-10">
      <h1 className="text-white text-3xl text-center pt-10">HELLO WORLD</h1>

      <div className="w-[70%] bg-slate-400 mt-[5rem] p-5 m-auto justify-end items-center flex flex-col min-h-[70vh]">
        <input
          className="bg-black text-white rounded-md w-[80%] p-2 "
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <button
          className="bg-black text-white p-1 text-2xl w-[20%]  mt-2 
        "
          onClick={() => {
            console.log(text);
            setText("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default withPusher(mapEventsToProps)(Chats);
