import React, { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import Message from "../components/blocks/Message";
import { useLocation } from "react-router-dom";
import Chat from "../components/blocks/Chat";

function Chats({ messages, setMessages }) {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const { state } = useLocation();
  const [currentChat, setCurrentChat] = useState(state?.id ?? "");
  useEffect(() => {
    setCurrentChat(state.id);
    setMessages([]);
  }, [state]);
  useEffect(() => {
    fetch(`http://89.111.131.15/api/default/chats`)
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        setChats(res.slice(0, 6));
      });
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
          {chats.map((el, index) => (
            <Chat chat={el} key={index} />
          ))}
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
              await ChatsApi.sendText(text, currentChat);

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
