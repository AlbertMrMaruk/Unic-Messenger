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
  FaWindowClose,
  FaReply,
  FaEllipsisV,
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
import { TooltipMessage } from "../components/blocks/TooltipMessage";
import { TooltipChats } from "../components/blocks/TooltipChats";
import ModalDownload from "../components/ModalDownload";

function Chats() {
  const navigate = useNavigate();
  const [session, setSession] = useState();
  const [replyMessage, setReplyMessage] = useState();
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dataUser, setDataUser] = useState();
  const [text, setText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [showSpinnerMessages, setShowSpinnerMessages] = useState(true);
  const [showChats, setShowChats] = useState(true);
  const [chats, setChats] = useState([]);
  const [file, setFile] = useState("");
  const [qrCode, setQrCode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalAccount, setShowModalAccount] = useState(false);
  const [showModalDownload, setShowModalDownload] = useState(false);
  const [sizeUser, setSizeUser] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const { state } = useLocation();
  const [currentChat, setCurrentChat] = useState(state?.id ?? "");
  const [newMessage, setNewMessage] = useState();
  const [percentage, setPercentage] = useState(0);

  // Функция получения сообщения
  useEffect(() => {
    const gettingMessage = (message) => {
      if (message.event === "message.any") {
        if (message.payload.fromMe) {
          setMessages((prev) => [message.payload, ...prev]);
          const chatIndex = chats.findIndex(
            (el) => el.id._serialized === currentChat
          );
          chats[chatIndex].messages = [
            ...chats[chatIndex].messages,
            message.payload,
          ];
          chats[chatIndex].lastMessage = {
            body: message.payload.body,
            ...message,
          };

          setDataUser((prev) => ({ ...prev, chats }));

          DatabaseAPI.updateUser(dataUser.username, { chats: dataUser.chats });
        } else {
          if (message.payload.from === currentChat) {
            setMessages((prev) => [message.payload, ...prev]);
            const chatIndex = chats.findIndex(
              (el) => el.id._serialized === currentChat
            );
            chats[chatIndex].messages = [
              ...chats[chatIndex].messages,
              message.payload,
            ];
            chats[chatIndex].lastMessage = {
              body: message.payload.body,
              ...message,
            };
            setDataUser((prev) => ({ ...prev, chats }));

            DatabaseAPI.updateUser(dataUser.username, {
              chats: dataUser.chats,
            });
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
            chats[chatIndex].messages = [
              ...chats[chatIndex].messages,
              message.payload,
            ];

            setDataUser((prev) => ({ ...prev, chats }));
            DatabaseAPI.updateUser(dataUser.username, {
              chats: dataUser.chats,
            });
          }
        }
      }
      // if (message.event === "session.status") {
      //   if (message.payload.status === "SCAN_QR_CODE") {
      //     console.log("scaaaan");
      //     setQrCode(`http://89.111.131.15/api/${message.session}/auth/qr`);
      //   }
      // }

      setChats((prev) =>
        prev.sort((chat1, chat2) => {
          const chat1time =
            +(chat1?.lastMessage?.payload?.timestamp + "000") ||
            +chat1?.lastMessage?.timestamp;
          const chat2time =
            +(chat2?.lastMessage?.payload?.timestamp + "000") ||
            +chat2?.lastMessage?.timestamp;
          return chat1time > chat2time ? -1 : 1;
        })
      );
    };
    if (newMessage) {
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
    //Загрузка информации о пользователе
    setCurrentUser({ pushName: userData[0].name });

    //ФУНКЦИЯ ДОБАВЛЕНИЯ ИНФОРМАЦИИ НА ПРИЛОЖЕНИЕ
    const dataToApp = (data) => {
      console.log("and what next");
      setDataUser(data);
      setAccounts(data.accounts);
      if (data.accounts.length !== 0) {
        setSession(data.accounts[0]);
      }
      setChats(
        data.chats.sort((chat1, chat2) => {
          const chat1time =
            +chat1?.lastMessage?.timestamp ||
            +(chat1?.lastMessage?.payload?.timestamp + "000");
          const chat2time =
            +chat2?.lastMessage?.timestamp ||
            +(chat2?.lastMessage?.payload?.timestamp + "000");

          return chat1time > chat2time ? -1 : 1;
        })
      );

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
      setShowSpinnerMessages(false);
    } else if (
      userData[0].accounts.length > 0 &&
      userData[0].chats.length === 0
    ) {
      setShowModalDownload(true);
      ChatsApi.getChats(userData[0].accounts[0])
        .then((resp) => resp.json())
        .then(async (res) => {
          console.log("Starting");
          const data = {
            ...userData[0],
            chats: res.slice(0, 40),
            chatsCount: 0,
          };
          let allSize = 0;
          // FETCH FUNCTION
          const delay = (ms) => new Promise((res) => setTimeout(res, ms));
          const fetchChat = async (el, index) => {
            await ChatsApi.getMessages(
              el?.id?._serialized,
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
                setPercentage((prev) => +prev + 2);
                data.chatsCount += 1;
                if (data.chatsCount === 40) {
                  console.log(allSize, "and nooooowwww");
                  data.allSize = allSize;
                  setPercentage(100);
                  DatabaseAPI.updateUser(userData[0].username, {
                    chats: data.chats,
                    allSize: data.allSize,
                    accounts: data.accounts,
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      console.log(res);
                      dataToApp(data);

                      setShowModalDownload(false);
                    });
                }
              });
            // Загрузка иконки профиля
            // await ChatsApi.getAvatar(el.id.user, userData[0].accounts[0])
            //   .then((el) => el.json())
            //   .then((el) => {
            //     console.log(el?.profilePictureURL);
            //     data.chats[index].avatar = el?.profilePictureURL;
            //     setPercentage((prev) => +prev + 1);
            //     data.chatsCount += 1;
            // if (data.chatsCount === 30) {
            //   console.log(allSize, "and nooooowwww");
            //   data.allSize = allSize;
            //   setPercentage(100);
            //   DatabaseAPI.updateUser(userData[0].username, {
            //     chats: data.chats,
            //     allSize: data.allSize,
            //     accounts: data.accounts,
            //   })
            //     .then((res) => res.json())
            //     .then((res) => {
            //       console.log(res);
            //       dataToApp(data);

            //       setShowModalDownload(false);
            //     });
            // }
            // });
          };
          for (let i = 0; i < 40; i++) {
            await fetchChat(data.chats[i], i);
            if (i === 10) {
              console.log("Delay");
              await delay(3000);
            }
          }
        });
    } else {
      console.log("Download and fetching", userData[0].accounts[0]);
      ChatsApi.getChats(userData[0].accounts[0])
        .then((el) => el.json())
        .then((res) => {
          const newChats = res.slice(0, 30);

          userData[0].chats.forEach((el) => {
            let countChatsUpdate = 0;
            let countChatsUpdated = 0;
            if (
              newChats.find((el2) => el.id._serialized === el2.id._serialized)
                ?.lastMessage?.timestamp > el.lastMessage.timestamp
            ) {
              countChatsUpdate++;
              console.log("OH YEAAA");
              ChatsApi.getMessages(
                el.id._serialized,
                20,
                userData[0].accounts[0]
              )
                .then((el) => el.json())
                .then((messages) => {
                  const superNew = messages.slice(
                    messages.findIndex(
                      (message) =>
                        el?.lastMessage?.timestamp === message?.timestamp
                    ) + 1
                  );
                  console.log(el.messages, superNew);
                  el.messages = [...el.messages, ...superNew];
                  el.lastMessage = superNew.at(-1);
                  console.log(el);
                  countChatsUpdated++;
                  if (countChatsUpdate === countChatsUpdated) {
                    DatabaseAPI.updateUser(userData[0].username, {
                      chats: userData[0].chats,
                    });
                    console.log("ddd");
                    dataToApp(userData[0]);
                  }
                  //TODO: Убрать количество обновления базы данных
                });
            }
          });
        });
      dataToApp(userData[0]);
    }
  };
  useEffect(() => {
    onLoad();
  }, []);

  // Смена чата
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
  const sendMessage = async (text, img, fileType, data) => {
    await ChatsApi.sendSeen(currentChat, session);
    await ChatsApi.startTyping(currentChat, session);
    setTimeout(async () => {
      await ChatsApi.stopTyping(currentChat, session);
      if (img) {
        ChatsApi.sendImage(data);
      } else {
        if (!replyMessage) {
          ChatsApi.sendText(text, currentChat, session);
        } else {
          ChatsApi.replyTo(text, currentChat, session, replyMessage);
          setReplyMessage("");
        }
      }
    }, 1000);
    setText("");
  };
  return (
    <div className="bg-secondary text-white flex  h-[100vh]">
      {/* Left Sidebar */}
      <div
        className={`w-[100%] ${
          showChats ? "block" : "hidden"
        } overflow-hidden md:w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] h-[100vh] p-[1rem] 
       `}
      >
        {/* Top menu */}
        <div
          className="flex  items-center pt-[.5rem] w-[100%] px-[1rem]  cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="bg-white rounded-full w-[41px] h-[40px]">
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
                currentChat={currentChat}
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
            <div className="flex  items-center py-0 md:py-[.8rem] justify-between w-[90%] md:w-[100%] px-[.5rem] md:px-[3rem] ml-1 md:ml-0">
              <div className="flex items-center">
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
              <TooltipChats
                session={session}
                chatId={state?.id}
                dataUser={dataUser}
                setChats={setChats}
                chats={chats}
                setMessages={setMessages}
              >
                <FaEllipsisV className="w-[20px] h-[20px] cursor-pointer  text-white" />
              </TooltipChats>
            </div>
          </div>
        )}
        {/* Messages in chat */}
        <div
          className={`w-[100%] flex-col-reverse py-3  flex items-start justify-start px-[.25rem] md:px-[2.5rem] overflow-scroll h-[70vh] ${
            replyMessage ? "md:h-[75vh]" : "md:h-[80vh]"
          }  mt-2`}
        >
          {showSpinnerMessages ? (
            <Spinner />
          ) : (
            messages.map((el, index) => (
              <TooltipMessage message={el} setReplyMessage={setReplyMessage}>
                <Message message={el} key={index} />
              </TooltipMessage>
            ))
          )}
        </div>
        {/* Input and buttons for send messages */}
        <div className="w-[100%] h-[8h]  justify-center items-center">
          {replyMessage && (
            <div className="w-[95%] md:w-[90%] flex bg-[#b5b5b566] rounded-t-xl m-auto py-2 px-3 justify-between items-center">
              <div className="flex justify-center items-center">
                <FaReply className="w-[30px] mr-3" />
                <span className="text-md">
                  {replyMessage.body ?? replyMessage.payload.body}
                </span>
              </div>
              <FaWindowClose
                className="w-[50px]"
                onClick={() => setReplyMessage()}
              />
            </div>
          )}
          <div className="relative flex flex-wrap items-stretch m-auto w-[95%] md:w-[90%]">
            <input
              type="text"
              onKeyDown={(e) => {
                // console.log(e.key);
                if (e.key === "Enter") {
                  sendMessage(text);
                }
              }}
              className={`
              bg-secondarylight text-white    ${
                replyMessage ? "rounded-bl-xl" : "rounded-l-xl"
              }
              p-2 px-4 h-[45px] 
              relative  -mr-0.5 block w-[1px] min-w-0 flex-auto  outline-none `}
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
              class={`bg-primary  p-1 text-xs z-[2] inline-block   ${
                replyMessage ? "rounded-br-xl" : "rounded-r-xl"
              } w-[55px] h-[45px] text-white font-bold uppercase`}
              type="button"
              onClick={() => sendMessage(text)}
            >
              <FaArrowCircleUp className="text-white w-[25px] h-[25px] m-auto" />
            </button>
          </div>
        </div>
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
          qrCode={qrCode}
          setQrCode={setQrCode}
          onLoad={onLoad}
          setShowModal={setShowModalAccount}
          session={session}
          dataUser={dataUser}
          setAccounts={setAccounts}
        />
      )}
      {/* Modal To Download Chats */}
      {showModalDownload && (
        <ModalDownload
          percentage={percentage}
          session={session}
          setShowModal={setShowModalDownload}
        />
      )}
    </div>
  );
}

export default Chats;
