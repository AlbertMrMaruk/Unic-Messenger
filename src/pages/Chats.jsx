import React, { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import Message from "../components/blocks/Message";

function Chats({ messages, setMessages }) {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  useEffect(async () => {
    setChats(await ChatsApi.getChats());
  }, []);
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
          {chats?.slice(0, 7).map((el, index) => {
            <div
              className="p-[1rem]  
  border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-[#1f2022]"
              key={index}
            >
              <div className="bg-white rounded-full w-[40px] h-[40px]"></div>
              <div className="flex flex-col gap-1 text-[#e9e9e9] text-left">
                <h3 className="text-md">{el?.name}</h3>
                <p className="text-xs text-[#777779]">
                  {el?.fromMe ? "Вы: " : ""}
                  {el?.lastMessage.body}{" "}
                </p>
              </div>
            </div>;
          })}
        </div>
      </div>
      <div
        className="w-[72%] bg-inherit min-h-[100vh]
       "
      >
        <div className="w-[100%] min-h-[90vh] flex-col py-3  flex items-start justify-end px-[2.5rem]">
          {messages.map((el) => {
            console.log(el);
            return <Message message={el} />;
          })}
        </div>
        <div className="w-[100%] min-h-[10h] flex justify-center items-center">
          <input
            className="bg-[#1c1d1f] text-white rounded-xl  w-[80%] p-2 px-4 h-[45px] mr-2"
            placeholder="Ваше сообщение"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="bg-[#44a0ff] rounded-xl text-white p-1 text-xl w-[65px] h-[45px]
        "
            onClick={async () => {
              console.log(text);
              setMessages((prev) => [
                ...prev,
                { payload: { body: text }, event: "send" },
              ]);
              await ChatsApi.sendText(text, "79253580573");

              setText("");
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chats;
