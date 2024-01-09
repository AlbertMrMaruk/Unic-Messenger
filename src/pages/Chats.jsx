import React, { useEffect, useRef, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import {
  FaArrowLeft,
  FaMicrophone,
  FaFile,
  FaArrowCircleUp,
  FaSmile,
  FaWindowClose,
  FaReply,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";
import clickChat from "../api/controlers/ChatsController";
import Message from "../components/blocks/Message";
import Spinner from "../components/blocks/Spinner";
import { useLocation } from "react-router-dom";
import { Tooltip } from "../components/blocks/Tooltip";
import Modal from "../components/Modal";
import ModalAccount from "../components/ModalAccount";
import DatabaseAPI from "../api/DatabaseAPI";
import { useNavigate } from "react-router-dom";
import { TooltipMessage } from "../components/blocks/TooltipMessage";
import { TooltipChats } from "../components/blocks/TooltipChats";
import ModalDownload from "../components/ModalDownload";
import TooltipVoice from "../components/blocks/TooltipVoice";
import ModalChats from "../components/ModalChats";
import { formatDate } from "../utils/utils";
import ModalReply from "../components/ModalReply";
import { useDispatch, useSelector } from "react-redux";
import {
  changeMessages,
  setReplyMessage,
  // setChats,
} from "../store/reducers/chat";
import Sidebar from "../components/blocks/Sidebar";

function Chats() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const [session, setSession] = useState();
  const [accounts, setAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dataUser, setDataUser] = useState();
  const [filtChats, setFiltChats] = useState();
  const [text, setText] = useState("");
  const [showSpinner, setShowSpinner] = useState(true);
  const [showSpinnerMessages, setShowSpinnerMessages] = useState(true);
  const [webSocket, setWebSocket] = useState();
  const [showChats, setShowChats] = useState(true);
  const [chats, setChats] = useState([]);
  const [file, setFile] = useState("");
  const [qrCode, setQrCode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalChats, setShowModalChats] = useState(false);
  const [showModalReply, setShowModalReply] = useState(false);
  const [showModalAccount, setShowModalAccount] = useState(false);
  const [showModalDownload, setShowModalDownload] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sizeUser, setSizeUser] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const { state } = useLocation();
  const [currentChat, setCurrentChat] = useState(state?.id ?? "");
  const [newMessage, setNewMessage] = useState();
  const [percentage, setPercentage] = useState(0);

  //Configuring Store Redux
  const messagesStore = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const replyMessage = useSelector((state) => state.chat.replyMessage);
  // const chats = useSelector((state) => state.chat.chats);

  // Функция получения сообщения
  useEffect(() => {
    const gettingMessage = (message) => {
      if (
        sizeUser === 0 ||
        message?.payload?.ackName === "UNKNOWN" ||
        message?.payload?.from === "status@broadcast"
      ) {
        return;
      }

      if (message.event === "message.any") {
        const messageFromMe = message.payload.fromMe
          ? message.payload.to
          : message.payload.from;
        if (messageFromMe === currentChat) {
          message.payload.author = {
            user: message.payload._data?.author?.user,
          };
          message.payload.notifyName = message.payload?._data?.notifyName;

          setMessages((prev) => [message.payload, ...prev]);
          const chatIndex = chats.findIndex(
            (el) => el.id._serialized === currentChat
          );
          chats[chatIndex].messages = [
            ...chats[chatIndex].messages,
            message.payload,
          ];
          chats[chatIndex].lastMessage = {
            ...message.payload,
          };
          let allSize = dataUser.allSize;
          if (message?.payload?._data?.size) {
            allSize += message?.payload?._data?.size;
          }
          setSizeUser(+allSize / (1024 * 1024));
          setDataUser((prev) => ({
            ...prev,
            chats: { [session]: chats, ...dataUser.chats },
            allSize,
          }));

          DatabaseAPI.updateUser(dataUser.username, {
            chats: { ...dataUser.chats, [session]: chats },
            allSize: allSize,
          });
        } else {
          message.payload.author = {
            user: message.payload._data?.author?.user,
          };
          message.payload.notifyName = message.payload?._data?.notifyName;
          setMessages((prev) => prev);
          const chatIndex = chats.findIndex(
            (el) => el?.id?._serialized === messageFromMe
          );
          if (chatIndex === -1) {
            const newChat = {
              id: {
                _serialized: messageFromMe,
              },
              name:
                message.payload?._data?.notifyName ??
                messageFromMe.slice(0, -5),
              isGroup: messageFromMe.at(-5) === "g",
              unreadCount: message.payload.fromMe ? 0 : 1,
              messages: [message.payload],
              lastMessage: {
                ...message.payload,
              },
            };
            let allSize = dataUser.allSize;
            if (message?.payload?._data?.size) {
              allSize += message?.payload?._data?.size;
            }
            setSizeUser(+allSize / (1024 * 1024));
            setDataUser((prev) => ({
              ...prev,
              chats: {
                ...prev.chats,
                [session]: [...prev.chats[session], newChat],
              },
              allSize,
            }));
            DatabaseAPI.updateUser(dataUser.username, {
              chats: {
                ...dataUser.chats,
                [session]: [...dataUser.chats[session], newChat],
              },
              allSize,
            }).then(() => {
              // dispatch(setChats([...dataUser.chats[session], newChat]));
              setChats(
                [...dataUser.chats[session], newChat]?.sort((chat1, chat2) => {
                  const chat1time =
                    +chat1?.lastMessage?.timestamp ||
                    +(chat1?.lastMessage?.payload?.timestamp + "000");
                  const chat2time =
                    +chat2?.lastMessage?.timestamp ||
                    +(chat2?.lastMessage?.payload?.timestamp + "000");

                  return chat1time > chat2time ? -1 : 1;
                }) ?? []
              );
            });
          } else {
            //Если сообщение не от меня то добавить количество непрочитанных
            if (!message.payload.fromMe) chats[chatIndex].unreadCount += 1;
            chats[chatIndex].lastMessage = {
              body: message.payload.body,
              ...message.payload,
            };
            chats[chatIndex].messages = [
              ...chats[chatIndex].messages,
              message.payload,
            ];

            let allSize = dataUser.allSize;
            if (message?.payload?._data?.size) {
              allSize += message?.payload?._data?.size;
            }
            setSizeUser(+allSize / (1024 * 1024));
            setDataUser((prev) => ({
              ...prev,
              chats: { [session]: chats, ...dataUser.chats },
              allSize,
            }));
            DatabaseAPI.updateUser(dataUser.username, {
              chats: { ...dataUser.chats, [session]: chats },
              allSize,
            });
          }
        }
      }

      // dispatch(setChats(chats));
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
    console.log("Started WEBSOCKET");
    console.log(session);
    if (session && !webSocket) {
      setWebSocket(clickChat(setNewMessage, session));
    } else if (session && webSocket) {
      webSocket.close(3333);
      setFiltChats();
      setWebSocket(clickChat(setNewMessage, session));
    }
  }, [session]);

  // Загрузка базы данных
  const onLoad = async (currentSession) => {
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
    const dataToApp = (data, session) => {
      setDataUser(data);
      setAccounts(data.accounts);
      if (data.accounts.length !== 0) {
        setSession(session);
        console.log("Session changed");
      }
      // dispatch(setChats(data.chats[session]));
      setChats(
        data.chats[session]?.sort((chat1, chat2) => {
          const chat1time =
            +chat1?.lastMessage?.timestamp ||
            +(chat1?.lastMessage?.payload?.timestamp + "000");
          const chat2time =
            +chat2?.lastMessage?.timestamp ||
            +(chat2?.lastMessage?.payload?.timestamp + "000");

          return chat1time > chat2time ? -1 : 1;
        }) ?? []
      );

      setSizeUser(+data.allSize / (1024 * 1024));
      setShowSpinner(false);
      if (state?.id) {
        setMessages(
          data.chats[session]
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
      setShowSpinner(false);
      setShowModalAccount(true);
    } else if (
      userData[0].accounts.length > 0 &&
      (userData[0].chats?.[session]?.length === 0 || !userData[0].chats)
    ) {
      let currentSession = session ?? userData[0].accounts[0];
      setSession(currentSession);
      setShowModalDownload(true);

      ChatsApi.getChats(currentSession)
        .then((resp) => resp.json())
        .then(async (res) => {
          console.log("Starting");
          const data = {
            ...userData[0],
            chats: { ...userData[0].chats, [currentSession]: res.slice(0, 35) },
            chatsCount: 0,
          };
          let allSize = 0;
          // FETCH FUNCTION
          const delay = (ms) => new Promise((res) => setTimeout(res, ms));
          const fetchChat = async (el, index) => {
            if (!el?.id?._serialized) {
              data.chatsCount += 1;
              return;
            }

            await ChatsApi.getMessages(el?.id?._serialized, 30, currentSession)
              .then((res) => res.json())
              .then((res) => {
                data.chats[currentSession][index].messages = res.map((el) => {
                  delete el.vCards;
                  el.author = { user: el._data?.author?.user };
                  el.notifyName = el?._data?.notifyName;
                  if (el.hasMedia) {
                    if (+el._data.size > 0) {
                      el.size = el._data.size;
                      allSize += +el._data.size;
                    }
                  }
                  delete el._data;
                  return el;
                });
                setPercentage((prev) => +prev + 1);
              });
            // Загрузка иконки профиля
            await ChatsApi.getAvatar(el.id.user, currentSession)
              .then((el) => el.json())
              .then((el) => {
                data.chats[currentSession][index].avatar =
                  el?.profilePictureURL;
                setPercentage((prev) => +prev + 1);
                data.chatsCount += 1;
                if (data.chatsCount === 35) {
                  data.allSize = allSize;

                  DatabaseAPI.updateUser(userData[0].username, {
                    chats: data.chats,
                    allSize: data.allSize,
                    accounts: data.accounts,
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      setPercentage(100);
                      dataToApp(data, currentSession);
                    });
                }
              });
          };
          for (let i = 0; i < 35; i++) {
            try {
              await fetchChat(data.chats[currentSession][i], i);
            } catch (error) {
              console.log(error);
              data.chatsCount += 1;

              continue;
            }

            if (i === 10) {
              console.log("Delay");
              await delay(3000);
            }
          }
        });
    } else {
      const correctSession = currentSession ?? userData[0].accounts[0];
      console.log("Download and fetching", correctSession);
      ChatsApi.getChats(correctSession)
        .then((el) => el.json())
        .then((res) => {
          const newChats = res.slice(0, 20);

          newChats.forEach((el) => {
            let countChatsUpdate = 0;
            let countChatsUpdated = 0;

            const el2 = userData[0].chats?.[correctSession].find(
              (el2) => el.id._serialized === el2.id._serialized
            );

            if (!el2) {
              countChatsUpdate++;
              el.messages = [el.lastMessage];
              userData[0].chats = {
                ...userData[0].chats,
                [correctSession]: [el, ...userData[0].chats?.[correctSession]],
              };

              countChatsUpdated++;

              return;
            }

            if (el?.lastMessage?.timestamp > el2?.lastMessage?.timestamp) {
              countChatsUpdate++;

              ChatsApi.getMessages(el.id._serialized, 20, correctSession)
                .then((el) => el.json())
                .then((messages) => {
                  const superNew = messages.slice(
                    messages.findIndex(
                      (message) =>
                        el2?.lastMessage?.timestamp === message?.timestamp
                    ) + 1
                  );
                  superNew.forEach((message) => {
                    delete message.vCards;
                    message.author = { user: message._data?.author?.user };
                    message.notifyName = message?._data?.notifyName;
                    if (message.hasMedia) {
                      if (+message._data.size > 0) {
                        message.size = message._data.size;
                        console.log(dataUser, message);
                        setDataUser((el) => ({
                          ...el,
                          allSize:
                            (dataUser?.allSize ?? 0) + +message?._data?.size,
                        }));
                      }
                    }
                    delete message._data;
                  });

                  el2.messages = [...el2.messages, ...superNew];
                  el2.lastMessage = superNew.at(-1);

                  countChatsUpdated++;
                  if (countChatsUpdate === countChatsUpdated) {
                    console.log("Updated", userData[0].chats);
                    DatabaseAPI.updateUser(userData[0].username, {
                      chats: {
                        ...userData[0].chats,
                        [correctSession]: userData[0].chats?.[correctSession],
                      },
                    });

                    dataToApp(userData[0], correctSession);
                    return;
                  }
                });
            }
          });
          //   if (countChatsUpdate === countChatsUpdated) {
          //     console.log("Updated", userData[0].chats);
          //     DatabaseAPI.updateUser(userData[0].username, {
          //       chats: {
          //         ...userData[0].chats,
          //         [correctSession]: userData[0].chats?.[correctSession],
          //       },
          //     });

          //     dataToApp(userData[0], correctSession);
          //     return;
          //   }
        });
      dataToApp(userData[0], correctSession);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  // Смена чата
  useEffect(() => {
    const changeState = async () => {
      console.log(state);
      if (state?.id && dataUser?.chats) {
        setShowSpinnerMessages(true);
        setCurrentChat(state?.id);
        const updatedMessages = dataUser.chats[session ?? dataUser.accounts[0]]
          .find((el) => el.id._serialized === state?.id)
          .messages.toReversed();
        dispatch(changeMessages(updatedMessages));
        setMessages(updatedMessages);
        setShowSpinnerMessages(false);
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
      if (state?.session !== session) {
        console.log(state?.session, "IT s wil changed");
        setSession(state?.session);
        onLoad(state?.session);
      } else if (!session) {
        onLoad();
      }
    };
    changeState();
  }, [state]);

  // Фокусировка на инпуте
  const focusOn = () => inputRef.current.focus();

  //Функция отправки сообщения
  const sendMessage = async (text, type, data) => {
    await ChatsApi.sendSeen(currentChat, session);
    await ChatsApi.startTyping(currentChat, session);
    setTimeout(async () => {
      await ChatsApi.stopTyping(currentChat, session);
      if (type === "img") {
        ChatsApi.sendImage(data);
      } else if (type === "voice") {
        ChatsApi.sendVoice(text, currentChat, session).then(() =>
          setAudioUrl(null)
        );
      } else {
        if (!replyMessage) {
          ChatsApi.sendText(text, currentChat, session);
        } else {
          ChatsApi.replyTo(text, currentChat, session, replyMessage);
          dispatch(setReplyMessage(""));
        }
      }
    }, 1000);
    setText("");
    focusOn();
  };
  return (
    <div className="bg-secondary text-white flex  h-[100vh]">
      {/* Left Sidebar */}
      <Sidebar
        onLoad={onLoad}
        showChats={showChats}
        setShowModalAccount={setShowModalAccount}
        sizeUser={sizeUser}
        accounts={accounts}
        session={session}
        showSpinner={showSpinner}
        chats={chats}
        setFiltChats={setFiltChats}
        filtChats={filtChats}
        currentUser={currentUser}
        currentChat={currentChat}
        setShowChats={setShowChats}
        dataUser={dataUser}
        setShowModalChats={setShowModalChats}
      />

      {/* Main Part */}
      <div
        className={`w-[100%] ${
          !showChats ? "block" : "hidden"
        } md:block md:w-[72%] bg-inherit 
            `}
      >
        {/* Top Menu Contact Name */}
        {state && (
          <div className="sticky top-0  z-50 bg-inherit flex justify-center items-center gap-2 md:block h-[10vh] border-b-[1px] border-[#2a2a2a]">
            <div
              className="block mr-[1.5rem]  ml-[1rem] md:hidden"
              onClick={() => setShowChats(true)}
            >
              <FaArrowLeft className="w-[25px] h-[25px] m-auto text-white" />
            </div>
            <div className="flex  items-center py-0 md:py-[.8rem] justify-between w-[90%] md:w-[100%] px-[.5rem] md:px-[3rem] ml-1 md:ml-0">
              <div className="flex items-center">
                <div className="bg-[#ababab]  rounded-full w-[40px] h-[40px] ">
                  {state?.img && (
                    <img
                      src={state?.img}
                      className="rounded-full w-[100%]"
                      alt={state?.name}
                    />
                  )}
                </div>
                <h3 className="font-bold text-white  ml-[1.5rem]  text-[1.3rem]">
                  {state?.name}
                </h3>
              </div>
              <TooltipChats
                session={session}
                chatId={state?.id}
                dataUser={dataUser}
                setDataUser={setDataUser}
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
          className={`bg-inherit w-[100%] flex-col-reverse py-3  flex items-start justify-start px-[.25rem] md:px-[2.5rem] overflow-scroll h-[77vh] ${
            replyMessage ? "md:h-[75vh]" : "md:h-[80vh]"
          }  mt-2`}
          ref={messagesRef}
        >
          {showSpinnerMessages ? (
            <Spinner />
          ) : (
            messages.map((el, index) => {
              const formattedDate1 = formatDate(+(el?.timestamp + "000"));
              const formattedDate2 = formatDate(
                +(messages[index - 1]?.timestamp + "000")
              );

              if (formattedDate1 !== formattedDate2 && messages[index - 1]) {
                return (
                  <>
                    <div className="flex w-[100%] gap-[0.5rem] items-center px-3 my-[1rem]">
                      <div className="bg-primary h-[2px] w-[42%] md:w-[45%]"></div>
                      <span className="text-[14px] font-semibold text-primary md:w-[10%] w-[16%] text-center">
                        {formattedDate2}
                      </span>
                      <div className="bg-primary h-[2px] w-[42%] md:w-[45%]"></div>
                    </div>

                    <TooltipMessage
                      session={session}
                      message={el}
                      isGroup={el.from.at(-4) === "g"}
                      setShowModalReply={setShowModalReply}
                      focusOn={focusOn}
                      setReplyMessage={setReplyMessage}
                    >
                      <Message
                        message={el}
                        isGroup={el.from.at(-4) === "g"}
                        key={index}
                      />
                    </TooltipMessage>
                  </>
                );
              }

              return (
                <TooltipMessage
                  session={session}
                  message={el}
                  focusOn={focusOn}
                  setShowModalReply={setShowModalReply}
                  setReplyMessage={setReplyMessage}
                  isGroup={el.from.at(-4) === "g"}
                >
                  <Message
                    message={el}
                    key={index}
                    isGroup={el.from.at(-4) === "g"}
                  />
                </TooltipMessage>
              );
            })
          )}
        </div>
        {/* Input and buttons for send messages */}
        <div
          className={`sticky bg-inherit pt-[1rem] md:p-0 bottom-0 w-[100%] h-[8vh] ${
            replyMessage ? "pb-[7rem]" : "pb-[4rem]"
          } `}
        >
          {replyMessage && (
            <div className="w-[95%] md:w-[90%] flex bg-[#b5b5b566] rounded-t-xl m-auto py-2 px-3 justify-between items-center">
              <div className="flex justify-center items-center">
                <FaReply className="w-[30px] mr-3" />
                <span className="text-md">
                  {(replyMessage?.body ?? replyMessage?.payload?.body).length >
                  30
                    ? (replyMessage?.body ?? replyMessage?.payload?.body).slice(
                        0,
                        30
                      ) + "..."
                    : replyMessage?.body ?? replyMessage?.payload?.body}
                </span>
              </div>
              <FaWindowClose
                className="w-[50px]"
                onClick={() => dispatch(setReplyMessage())}
              />
            </div>
          )}
          <div className="sticky bottom-0  flex flex-wrap items-stretch m-auto w-[95%] md:w-[90%]">
            {audioUrl ? (
              <div
                className={`
              bg-primary text-white    rounded-l-xl
              py-[.5rem] h-[45px] 
              relative  -mr-0.5 block w-[1px] min-w-0 flex-auto  outline-none `}
              >
                <audio controls src={audioUrl.url} className="mainaudio" />
              </div>
            ) : (
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(text);
                  }
                }}
                ref={inputRef}
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
            )}
            <Tooltip setText={setText} emoji={true}>
              <button
                className={`bg-secondarylight  text-white p-1 text-xs  z-[2] inline-block  rounded-none font-bold uppercase leading-normal w-[30px] h-[45px] ${
                  audioUrl && "hidden"
                }`}
                type="button"
              >
                <FaSmile className="text-white w-[18px] h-[18px] m-auto" />
              </button>
            </Tooltip>
            <TooltipVoice setAudioUrl={setAudioUrl} audioUrl={audioUrl}>
              <FaMicrophone className="text-white w-[18px] h-[18px] m-auto" />
            </TooltipVoice>
            {audioUrl && (
              <div
                className="bg-secondarylight  text-white px-2.5 z-[2] inline-block  rounded-none "
                onClick={() => setAudioUrl(null)}
              >
                <button
                  className={` p-1 text-xs  inline-block  rounded-none font-bold uppercase leading-normal w-[30px] h-[45px]
                `}
                  type="button"
                >
                  <FaTrash className="text-white w-[18px] h-[18px] m-auto" />
                </button>
              </div>
            )}
            <Tooltip
              setFile={setFile}
              setShowModal={setShowModal}
              showModal={showModal}
            >
              <button
                className={`bg-secondarylight  text-white p-1 text-xs  z-[2] inline-block  rounded-none font-bold uppercase leading-normal w-[40px] h-[45px]   ${
                  audioUrl && "hidden"
                }`}
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
              onClick={() => {
                if (text === "") {
                  return;
                }
                if (audioUrl) {
                  sendMessage(audioUrl.encoded, "voice");
                } else {
                  sendMessage(text);
                }
              }}
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
      {/* Modal to show chats actions */}
      {showModalChats && (
        <ModalChats
          setShowModal={setShowModalChats}
          session={session}
          setShowChats={setShowChats}
          dataUser={dataUser}
          setDataUser={setDataUser}
          setChats={setChats}
        />
      )}
      {/* Modal to reply message to another chat */}
      {showModalReply && (
        <ModalReply
          setShowModal={setShowModalReply}
          session={session}
          setShowChats={setShowChats}
          setReplyMessage={setReplyMessage}
        />
      )}
    </div>
  );
}

export default Chats;
