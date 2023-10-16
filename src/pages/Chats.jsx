import React, { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import {
  FaWhatsapp,
  FaPlus,
  FaArrowLeft,
  FaMicrophone,
  FaFile,
  FaArrowCircleUp,
  FaSmile,
} from "react-icons/fa";
import clickChat from "../api/controlers/ChatsController";
import Message from "../components/blocks/Message";
import Spinner from "../components/blocks/Spinner";
import { useLocation } from "react-router-dom";
import Chat from "../components/blocks/Chat";
import { Tooltip } from "../components/blocks/Tooltip";
import Modal from "../components/Modal";
import ModalAccount from "../components/ModalAccount";
import DatabaseAPI from "../api/DatabaseAPI";
import { useNavigate } from "react-router-dom";

function Chats() {
  const navigate = useNavigate();
  const [session, setSession] = useState();
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dataUser, setDataUser] = useState();
  const [text, setText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [showSpinnerMessages, setShowSpinnerMessages] = useState(true);
  const [showChats, setShowChats] = useState(true);
  const [chats, setChats] = useState([]);
  const [file, setFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalAccount, setShowModalAccount] = useState(false);
  const [sizeUser, setSizeUser] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const { state } = useLocation();
  const [currentChat, setCurrentChat] = useState(state?.id ?? "");
  //Старый код
  // useEffect(() => {
  //   // ChatsApi.getMessages(state?.id, 20, session)
  //   //   .then((resp) => {
  //   //     if (resp.ok) {
  //   //       return resp.json(); // then consume it again, the error happens
  //   //     }
  //   //   })
  //   //   .then((res) => {
  //   //     setMessages(res.reverse());
  //   //     setShowSpinnerMessages(false);
  //   //   });
  // }, [state]);

  const [newMessage, setNewMessage] = useState();
  // Проверка зайден пользователь или нет
  //Функция получения сообщения

  useEffect(() => {
    const gettingMessage = (message) => {
      console.log(message, currentChat, chats);
      if (message.payload.from === currentChat) {
        setMessages((prev) => [message, ...prev]);
        const chatIndex = chats.findIndex(
          (el) => el.id._serialized === currentChat
        );
        chats[chatIndex].messages = [...chats[chatIndex].messages, message];
        chats[chatIndex].lastMessage = {
          body: message.payload.body,
          ...message,
        };
        setDataUser((prev) => ({ ...prev, chats }));

        DatabaseAPI.updateUser(dataUser.username, { chats: dataUser.chats });
      } else {
        setMessages((prev) => prev);
        const chatIndex = chats.findIndex(
          (el) => el.id._serialized === message.payload.from
        );
        chats[chatIndex].unreadCount += 1;
        chats[chatIndex].lastMessage = {
          body: message.payload.body,
          ...message,
        };
        chats[chatIndex].messages = [...chats[chatIndex].messages, message];

        setDataUser((prev) => ({ ...prev, chats }));
        DatabaseAPI.updateUser(dataUser.username, { chats: dataUser.chats });
      }
    };
    if (newMessage) {
      console.log("New Message", newMessage);
      gettingMessage(newMessage);
    }
  }, [newMessage]);
  // Запуск Вебсокета
  useEffect(() => {
    console.log("Started");
    console.log(session);
    if (session) {
      clickChat(setNewMessage, session);
    }
  }, [session]);

  // Загрузка базы данных
  useEffect(() => {
    //Изменить активный чат
    const onLoad = async () => {
      const resp = await DatabaseAPI.verifyToken();
      const data = await resp.json();
      if (!data) {
        navigate("/sign-in");
        return;
      }
      const respUser = await DatabaseAPI.getUser(data.username);
      const userData = await respUser.json();
      setDataUser(userData[0]);
      console.log(userData[0]);

      //Загрузка информации о пользователе
      setCurrentUser({ pushName: userData[0].name });

      //Старый код
      /* const newChat = res.slice(0, 10);
    newChat.forEach((el, index) => {
      fetch(
        `http://89.111.131.15/api/contacts/profile-picture?contactId=${el?.id?.user}&session=${session}`
      )
        .then((el) => el.json())
        .then((res) => {
          el.img = res?.profilePictureURL;
          if (index === 9) {
            setChats(newChat);
            setShowSpinner(false);
          }
        });
    });

    Adding to mongoose database */

      //ФУНКЦИЯ ДОБАВЛЕНИЯ ИНФОРМАЦИИ НА ПРИЛОЖЕНИЕ
      const dataToApp = (data) => {
        setDataUser(data);
        setAccounts(data.accounts);
        if (data.accounts.length !== 0) {
          setSession(data.accounts[0]);
        }
        setChats(data.chats);
        setSizeUser(+data.allSize / (1024 * 1024));
        setShowSpinner(false);
        if (state?.id) {
          setMessages(
            data.chats
              .find((el) => el.id._serialized === state?.id)
              .messages.toReversed()
          );
        }

        setShowSpinnerMessages(false);
      };
      //Включается спиннер
      setShowSpinnerMessages(true);
      //Проверка аккаунтов пользователя
      if (userData[0].accounts.length === 0) {
        console.log("Add Account Maaan");
        setShowSpinnerMessages(false);
      } else if (
        userData[0].accounts.length > 0 &&
        userData[0].chats.length === 0
      ) {
        fetch(`http://89.111.131.15/api/${userData[0].accounts[0]}/chats`)
          .then((resp) => resp.json())
          .then((res) => {
            console.log("Starting");
            const data = {
              ...userData[0],
              chats: res.slice(0, 30),
              chatsCount: 0,
            };
            let allSize = 0;
            data.chats.forEach((el, index) => {
              ChatsApi.getMessages(
                el.id._serialized,
                30,
                userData[0].accounts[0]
              )
                .then((res) => res.json())
                .then((res) => {
                  data.chats[index].messages = res.map((el) => {
                    delete el.vCards;
                    if (el.hasMedia) {
                      console.log(el._data.size, allSize);
                      if (+el._data.size > 0) {
                        el.size = el._data.size;
                        allSize += +el._data.size;
                      }
                    }
                    delete el._data;
                    return el;
                  });
                  console.log("wtf", index, data.chats.length);
                  data.chatsCount += 1;
                  console.log(data.chatsCount);
                  if (data.chatsCount === 30) {
                    console.log(allSize);
                    data.allSize = allSize;
                    DatabaseAPI.updateUser(userData[0].username, {
                      chats: data.chats,
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log(res);
                        dataToApp(data);
                      });
                  }
                });
            });
          });
      } else {
        dataToApp(userData[0]);
      }
    };
    onLoad();
  }, []);

  useEffect(() => {
    const changeState = async () => {
      if (state?.id && dataUser?.chats) {
        setShowSpinnerMessages(true);
        setCurrentChat(state?.id);
        setMessages(
          dataUser.chats
            .find((el) => el.id._serialized === state?.id)
            .messages.toReversed()
        );
        setShowSpinnerMessages(false);
      }
    };
    changeState();
  }, [state]);

  //Функция отправки сообщения
  const sendMessage = async (text, img, fileType) => {
    await ChatsApi.sendSeen(currentChat, session);
    await ChatsApi.startTyping(currentChat, session);
    setTimeout(async () => {
      await ChatsApi.stopTyping(currentChat, session);
      ChatsApi.sendText(text, currentChat, session).then((res) => {
        const chatIndex = chats.findIndex(
          (el) => el.id._serialized === currentChat
        );
        if (img) {
          chats[chatIndex].lastMessage = {
            body: text,
            userMediaUrl: img,
            fileType: fileType,
            event: "send",
            fromMe: true,
            timestamp: Date.now(),
          };
          chats[chatIndex].messages = [
            ...chats[chatIndex].messages,
            {
              payload: { body: text, userMediaUrl: img, fileType: fileType },
              event: "send",
              timestamp: Date.now(),
            },
          ];
          setMessages((prev) => [
            {
              payload: { body: text, userMediaUrl: img, fileType: fileType },
              event: "send",
              timestamp: Date.now(),
            },
            ...prev,
          ]);
        } else {
          chats[chatIndex].lastMessage = {
            body: text,
            event: "send",
            fromMe: true,
            timestamp: Date.now(),
          };
          chats[chatIndex].messages = [
            ...chats[chatIndex].messages,
            {
              payload: { body: text },
              event: "send",
              timestamp: Date.now(),
            },
          ];
          setMessages((prev) => [
            {
              payload: { body: text },
              event: "send",
              timestamp: Date.now(),
            },
            ...prev,
          ]);
        }

        DatabaseAPI.updateUser(dataUser.username, { chats: dataUser.chats });
      });
    }, 1000);
    setText("");
  };
  return (
    <div className="bg-secondary text-white flex  h-[100vh]">
      {/* Left Sidebar */}

      <div
        className={`w-[100%] ${
          showChats ? "block" : "hidden"
        } md:w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] h-[100vh] p-[1rem] 
       `}
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
        <div className="flex flex-col px-3 py-3 rounded-xl bg-secondarylight gap-1 mt-[1.5rem]">
          <h3 className="font-bold text-white text-xl text-center">
            Размер: {(sizeUser + " ").slice(0, 4) ?? ""} Мб
          </h3>
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
            className="m-auto rounded-full bg-primary p-[0.65rem] mt-[.5rem] cursor-pointer"
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
            chats.map((el, index) => (
              <Chat
                chat={el}
                key={index}
                index={index}
                setShowChats={setShowChats}
                session={session}
                dataUser={dataUser}
              />
            ))
          )}
        </div>
      </div>
      {/* Main Part */}
      <div
        className={`w-[100%] ${
          !showChats ? "block" : "hidden"
        } md:block md:w-[72%] bg-inherit h-[100vh]
            `}
      >
        {/* Top Menu Contact Name */}
        {state && (
          <div className="bg-inherit flex justify-center items-center gap-2 md:block h-[10vh] border-b-[1px] border-[#2a2a2a]">
            <div
              className="block mr-[1.5rem]  ml-[1rem] md:hidden"
              onClick={() => setShowChats(true)}
            >
              <FaArrowLeft className="w-[25px] h-[25px] m-auto text-white" />
            </div>
            <div className="flex  items-center py-0 md:py-[.8rem] w-[90%] md:w-[100%] px-0 md:px-[3rem] ml-1 md:ml-0">
              <div className="bg-white rounded-full w-[40px] h-[40px] ">
                <img
                  src={state?.img}
                  className="rounded-full w-[100%]"
                  alt={state?.name}
                />
              </div>
              <h3 className="font-bold text-white  ml-[1.5rem]  text-[1.3rem]">
                {state?.name}
              </h3>
            </div>
          </div>
        )}
        {/* Messages in chat */}
        <div className="w-[100%] flex-col-reverse py-3  flex items-start justify-start px-[.25rem] md:px-[2.5rem] overflow-scroll h-[70vh] md:h-[80vh] mt-2">
          {showSpinnerMessages ? (
            <Spinner />
          ) : (
            messages.map((el, index) => <Message message={el} key={index} />)
          )}
        </div>
        {/* Input and buttons for send messages */}
        <div className="w-[100%] h-[7h]  justify-center items-center">
          <div className="relative flex flex-wrap items-stretch m-auto w-[95%] md:w-[90%]">
            <input
              type="text"
              className="
              bg-secondarylight text-white rounded-l-xl   
              p-2 px-4 h-[45px] 
              relative  -mr-0.5 block w-[1px] min-w-0 flex-auto  outline-none "
              placeholder="Ваше сообщение"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Tooltip setText={setText} emoji={true}>
              <button
                class="bg-secondarylight  text-white p-1 text-xs  z-[2] inline-block  rounded-none font-bold uppercase leading-normal w-[30px] h-[45px]"
                type="button"
              >
                <FaSmile className="text-white w-[18px] h-[18px] m-auto" />
              </button>
            </Tooltip>
            <button
              class="bg-secondarylight  text-white p-1 text-xs  z-[2] inline-block  rounded-none font-bold uppercase leading-normal w-[30px] h-[45px]"
              type="button"
            >
              <FaMicrophone className="text-white w-[18px] h-[18px] m-auto" />
            </button>
            <Tooltip
              setFile={setFile}
              setShowModal={setShowModal}
              showModal={showModal}
            >
              <button
                class="bg-secondarylight  text-white p-1 text-xs  z-[2] inline-block  rounded-none font-bold uppercase leading-normal w-[40px] h-[45px]"
                type="button"
              >
                <FaFile className="text-white w-[18px] h-[18px] m-auto" />
              </button>
            </Tooltip>
            <button
              class="bg-primary  p-1 text-xs z-[2] inline-block rounded-r-xl  w-[55px] h-[45px] text-white font-bold uppercase"
              type="button"
              onClick={() => sendMessage(text)}
            >
              <FaArrowCircleUp className="text-white w-[25px] h-[25px] m-auto" />
            </button>
          </div>

          {/* Modal  */}
          {showModal && (
            <Modal
              text={text}
              session={session}
              setText={setText}
              setMessages={setMessages}
              sendMessage={sendMessage}
              file={file}
              setShowModal={setShowModal}
            />
          )}
          {/* Modal To Connect New Account */}
          {showModalAccount && (
            <ModalAccount
              setDataUser={setDataUser}
              setSession={setSession}
              setShowModal={setShowModalAccount}
              session={session}
              dataUser={dataUser}
              setAccounts={setAccounts}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
