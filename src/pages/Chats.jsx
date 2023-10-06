import React, { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import { FaWhatsapp, FaPlus } from "react-icons/fa";
import Message from "../components/blocks/Message";
import Spinner from "../components/blocks/Spinner";
import { useLocation } from "react-router-dom";
import Chat from "../components/blocks/Chat";
import { Tooltip } from "../components/blocks/Tooltip";
import Modal from "../components/Modal";
import ModalAccount from "../components/ModalAccount";

function Chats({ messages, setMessages }) {
  const [session, setSession] = useState("default");
  const [accounts, setAccounts] = useState(["default"]);
  const [text, setText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [showSpinnerMessages, setShowSpinnerMessages] = useState(true);
  const [chats, setChats] = useState([]);
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalAccount, setShowModalAccount] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const { state } = useLocation();
  const [currentChat, setCurrentChat] = useState(state?.id ?? "");
  useEffect(() => {
    setCurrentChat(state?.id);
    setShowSpinnerMessages(true);
    ChatsApi.getMessages(state?.id, 20, session)
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); // then consume it again, the error happens
        }
      })
      .then((res) => {
        setMessages(res.reverse());
        setShowSpinnerMessages(false);
      });
  }, [state]);
  useEffect(() => {
    fetch(`http://89.111.131.15/api/sessions/${session}/me`)
      .then((res) => res.json())
      .then((res) => {
        fetch(
          `http://89.111.131.15/api/contacts/profile-picture?contactId=${res.id.slice(
            0,
            -5
          )}&session=${session}`
        )
          .then((img) => img.json())
          .then((img) => {
            setCurrentUser({ ...res, img: img.profilePictureURL });
          });
      });

    fetch(`http://89.111.131.15/api/default/chats`)
      .then((resp) => resp.json())
      .then((res) => {
        // Adding to mongoose database
        const data = JSON.stringify({
          name: "Albert Marukyan",
          accounts: [session],
          chats: res,
        });
        fetch(`http://89.111.131.15/database/users`)
          .then((res) => res.json())
          .then((res) => {
            if (!res.find((el) => el.name === "Albert Marukyan")) {
              fetch(`http://89.111.131.15/database/users`, {
                method: "post",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },

                body: data,
              })
                .then((res) => res.json())
                .then((res) => console.log(res));
            }
          });

        const newChat = res.slice(0, 10);
        newChat.forEach((el, index) => {
          fetch(
            `http://89.111.131.15/api/contacts/profile-picture?contactId=${el?.id?.user}&session=${session}`
          )
            .then((el) => el.json())
            .then((res) => {
              el.img = res?.profilePictureURL;
              if (index === newChat.length - 1) {
                setChats(newChat);
                setShowSpinner(false);
              }
            });
        });
      });
  }, [state]);
  return (
    <div className="bg-[#050505] flex  h-[100vh]">
      {/* Left Sidebar */}
      <div
        className="w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] h-[100vh] p-[1rem] 
       "
      >
        {/* Top menu */}
        <div className="flex  items-center pt-[.5rem] w-[100%] px-[1rem]">
          <div className="bg-white rounded-full w-[40px] h-[40px]">
            {currentUser?.img && (
              <img
                src={currentUser.img}
                className="rounded-full w-[100%]"
                alt={currentUser?.pushName}
              />
            )}
          </div>
          <h3 className="font-bold text-white text-xl ml-[1.5rem]">
            {currentUser?.pushName ?? ""}
          </h3>
        </div>
        {/* Choose messenger Block */}
        <div className="flex flex-col px-3 py-3 rounded-xl bg-[#1c1d1f] gap-1 mt-[1.5rem]">
          {accounts.map((el, index) => (
            <div
              className="p-[1rem]  
border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-[#3f4145]"
              key={index}
              onClick={() => setSession(el)}
            >
              <div className="rounded-full w-[40px] h-[40px] text-white ">
                <FaWhatsapp className="w-[40px] h-[40px]" />
              </div>
              <div className="flex flex-col gap-1 text-[#e9e9e9] text-left max-w-[75%]">
                <h3 className="text-md font-bold">WhatsApp Account</h3>
                <p className="text-[0.85rem] text-[#777779]">{el}</p>
              </div>
            </div>
          ))}
          <div
            className="m-auto rounded-full bg-[#44a0ff] p-[0.65rem] mt-[.5rem] cursor-pointer"
            onClick={() => setShowModalAccount(true)}
          >
            <FaPlus className="color-white bg-inherit w-[15px] h-[15px]" />
          </div>
        </div>
        {/* Chats */}
        <div
          className="flex flex-col
        items-center mt-[1rem] overflow-scroll h-[60vh]
         "
        >
          {showSpinner ? (
            <Spinner />
          ) : (
            chats.map((el, index) => <Chat chat={el} key={index} />)
          )}
        </div>
      </div>
      {/* Main Part */}
      <div
        className="w-[72%] bg-inherit h-[100vh]
       "
      >
        {/* Top Menu Contact Name */}
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
        {/* Messages in chat */}
        <div className="w-[100%] flex-col-reverse py-3  flex items-start justify-start px-[2.5rem] overflow-scroll h-[80vh] mt-2">
          {showSpinnerMessages ? (
            <Spinner />
          ) : (
            messages.map((el, index) => <Message message={el} key={index} />)
          )}
        </div>
        {/* Input and buttons for send messages */}
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
            <Tooltip
              setFile={setFile}
              setShowModal={setShowModal}
              showModal={showModal}
            >
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
                setMessages((prev) => [
                  {
                    payload: { body: text },
                    event: "send",
                    timestamp: Date.now(),
                  },
                  ...prev,
                ]);
                await ChatsApi.sendText(text, currentChat, session);

                setText("");
              }}
            >
              Отправить
            </button>
          </div>

          {/* Modal  */}
          {showModal && (
            <Modal
              text={text}
              session={session}
              setText={setText}
              setMessages={setMessages}
              file={file}
              setShowModal={setShowModal}
            />
          )}
          {/* Modal To Connect New Account */}
          {showModalAccount && (
            <ModalAccount
              setSession={setSession}
              setShowModal={setShowModalAccount}
              session={session}
              setAccounts={setAccounts}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
