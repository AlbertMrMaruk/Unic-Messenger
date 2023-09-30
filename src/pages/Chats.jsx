import React, { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import Message from "../components/blocks/Message";
import { useLocation } from "react-router-dom";
import Chat from "../components/blocks/Chat";
import { Tooltip } from "../components/blocks/Tooltip";
import Modal from "../components/Modal";

function Chats({ messages, setMessages }) {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const { state } = useLocation();
  const [currentChat, setCurrentChat] = useState(state?.id ?? "");
  useEffect(() => {
    setCurrentChat(state?.id);
    fetch(
      `http://89.111.131.15/api/default/chats/${state?.id}/messages?downloadMedia=true&limit=20`
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
    fetch(`http://89.111.131.15/api/sessions/default/me`)
      .then((res) => res.json())
      .then((res) => {
        fetch(
          `http://89.111.131.15/api/contacts/profile-picture?contactId=${res.id.slice(
            0,
            -5
          )}&session=default`
        )
          .then((img) => img.json())
          .then((img) => {
            setCurrentUser({ ...res, img: img.profilePictureURL });
          });
      });

    fetch(`http://89.111.131.15/api/default/chats`)
      .then((resp) => resp.json())
      .then((res) => {
        const newChat = res.slice(0, 10);
        newChat.forEach((el, index) => {
          fetch(
            `http://89.111.131.15/api/contacts/profile-picture?contactId=${el?.id?.user}&session=default`
          )
            .then((el) => el.json())
            .then((res) => {
              el.img = res?.profilePictureURL;
              if (index === newChat.length - 1) {
                setChats(newChat);
              }
            });
        });

        console.log(newChat, "ddd");
      });
  }, [state]);
  return (
    <div className="bg-[#050505] flex  h-[100vh]">
      <div
        className="w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] h-[100vh] p-[1rem] 
       "
      >
        <div className="flex  items-center pt-[.5rem] w-[100%] px-[1rem]">
          <div className="bg-white rounded-full w-[40px] h-[40px]">
            {currentUser?.img && (
              <img
                src={currentUser.img}
                className="rounded-full w-[100%]"
                alt={currentUser.name}
              />
            )}
          </div>
          <h3 className="font-bold text-white text-xl ml-[1.5rem]">
            {currentUser?.pushName ?? ""}
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
            <div className="flex  items-center py-[.8rem] w-[100%] px-[3rem]">
              <div className="bg-white rounded-full w-[40px] h-[40px]">
                <img
                  src={state?.img}
                  className="rounded-full w-[100%]"
                  alt={state?.name}
                />
              </div>
              <h3 className="font-bold text-white  ml-[1.5rem] text-[1.3rem]">
                {state?.name}
              </h3>
            </div>
          </div>
        )}

        <div className="w-[100%] flex-col-reverse py-3  flex items-start justify-start px-[2.5rem] overflow-scroll h-[80vh] mt-2">
          {messages.map((el) => (
            <Message message={el} />
          ))}
        </div>
        <div className="w-[100%] h-[7h]  justify-center items-center">
          <div className="relative flex flex-wrap items-stretch m-auto w-[90%]">
            <input
              type="text"
              className="
              bg-[#1c1d1f] text-white rounded-l-xl   
              p-2 px-4 h-[45px] 
              relative  -mr-0.5 block w-[1px] min-w-0 flex-auto  outline-none "
              placeholder="Ваше сообщение"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Tooltip setFile={setFile} setShowModal={setShowModal}>
              <button
                class="bg-[#44a0ff]  text-white p-1 text-xs  z-[2] inline-block  rounded-none font-bold uppercase leading-normal w-[65px] h-[45px]"
                type="button"
              >
                Файл
              </button>
            </Tooltip>
            <button
              class="bg-[#44a0ff]  p-1 text-xs z-[2] inline-block rounded-r-xl  w-[95px] h-[45px] text-white font-bold uppercase"
              type="button"
              onClick={async () => {
                console.log(text);
                setMessages((prev) => [
                  { payload: { body: text }, event: "send" },
                  ...prev,
                ]);
                await ChatsApi.sendText(text, currentChat);

                setText("");
              }}
            >
              Отправить
            </button>
          </div>
        </div>
        <Modal file={file} showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
}

export default Chats;
