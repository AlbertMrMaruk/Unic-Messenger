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
    setCurrentChat(state?.id);
    fetch(
      `http://89.111.131.15/api/default/chats/${state?.id}/messages?downloadMedia=false&limit=20`
    )
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); //then consume it again, the error happens
        }
      })
      .then((res) => {
        console.log(res);
        setMessages(res.reverse());
      });
  }, [state]);
  useEffect(() => {
    fetch(`http://89.111.131.15/api/default/chats`)
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res);
        setChats(res.slice(0, 10));
      });
  }, []);
  return (
    <div className="bg-[#050505] flex  h-[100vh]">
      <div
        className="w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] h-[100vh] p-[1rem] 
       "
      >
        <div className="flex  items-center pt-[.5rem] w-[100%] px-[1rem]">
          <div className="bg-white rounded-full w-[45px] h-[45px]"></div>
          <h3 className="font-bold text-white text-xl ml-[2rem]">
            Альберт Марукян
          </h3>
        </div>
        <div
          className="flex flex-col
        items-center mt-[2rem] overflow-scroll h-[85vh]
         "
        >
          {chats.map((el, index) => (
            <Chat chat={el} key={index} />
          ))}
        </div>
      </div>
      <div
        className="w-[72%] bg-inherit h-[100vh]
       "
      >
        {state && (
          <div className="bg-inherit h-[10vh] border-b-[1px] border-[#2a2a2a]">
            <div className="flex  items-center pt-[.5rem] w-[100%] px-[3rem]">
              <div className="bg-white rounded-full w-[45px] h-[45px]"></div>
              <h3 className="font-bold text-white text-xl ml-[2rem]">
                {state?.name}
              </h3>
            </div>
          </div>
        )}

        <div className="w-[100%] flex-col-reverse py-3  flex items-start justify-start px-[2.5rem] overflow-scroll h-[80vh] mt-2">
          {messages.map((el) => {
            console.log(el);
            return <Message message={el} />;
          })}
        </div>
        <div className="w-[100%] h-[7h] flex justify-center items-center">
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
