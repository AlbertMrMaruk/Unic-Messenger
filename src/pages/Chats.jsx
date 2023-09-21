import React, { useState } from "react";
import clickChat from "../api/controlers/ChatsController";
// import withPusher from "react-pusher-hoc";
// import mapEventsToProps from "../api/controlers/ChatsController";

function Chats() {
  const [text, setText] = useState("");
  return (
    <div className="bg-[#050505] flex h-max min-h-[100vh]">
      <div
        className="w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] min-h-[100vh] p-[2rem]
       "
      >
        <div className="flex  items-center justify-between w-[100%]">
          <div className="bg-white rounded-full w-[45px] h-[45px]"></div>
        </div>
        <div
          className="flex flex-col
        items-center mt-[2rem]
         "
        >
          <div
            className="p-[1rem] 
             border-[#2a2a2a] w-[100%] flex items-center gap-6 cursor-pointer hover:bg-[#1f2022]"
          >
            <div className="bg-white rounded-full w-[40px] h-[40px]"></div>
            <div className="flex flex-col gap-2 text-white text-left">
              <h3 className="text-md">Alex</h3>
              <p className="text-xs">Text something</p>
            </div>
          </div>
          <div
            className="p-[1rem]  
             border-[#2a2a2a] w-[100%] flex items-center gap-6 cursor-pointer hover:bg-[#1f2022]"
          >
            <div className="bg-white rounded-full w-[40px] h-[40px]"></div>
            <div className="flex flex-col gap-2 text-white text-left">
              <h3 className="text-md">Alex</h3>
              <p className="text-xs">Text something</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-[72%] bg-inherit min-h-[100vh]
       "
      >
        <div className="w-[100%] min-h-[90vh]"></div>
        <div className="w-[100%] min-h-[10h] flex justify-center items-center">
          <input className="bg-[#1c1d1f] text-white rounded-lg  w-[80%] p-2 h-[45px] mr-2" />
          <button
            className="bg-[#44a0ff] rounded-lg text-white p-1 text-xl w-[65px] h-[45px]
        "
            onClick={() => {
              console.log(text);
              setText("");
              clickChat();
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/*       
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
            clickChat();
          }}
        >
          Send
        </button>
      </div> */}
    </div>
  );
}

// export default withPusher(mapEventsToProps)(Chats);

export default Chats;
