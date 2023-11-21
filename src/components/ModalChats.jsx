import Spinner from "./blocks/Spinner";
import { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";
import DatabaseAPI from "../api/DatabaseAPI";

export default function ModalChats({
  setShowModal,
  session,
  setDataUser,
  dataUser,
  setChats,
}) {
  const [showSpinner, setShowSpinner] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState();
  const [queryContact, setQueryContact] = useState();
  const [filtContacts, setFiltContacts] = useState();

  useEffect(() => {
    ChatsApi.getContacts(session)
      .then((el) => el.json())
      .then((el) => {
        setContacts(el);
        setFiltContacts(el);
        setShowSpinner(false);
      });
  }, []);

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,.7)]">
      <div className="relative my-6 mx-auto w-[90%] md:w-[50%]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondarylight outline-none focus:outline-none">
          <div className="flex flex-col items-start justify-between p-5  rounded-t ">
            <h3 className="md:text-3xl font-bold text-white m-auto text-center md:text-left text-[1.65rem]">
              Создать новый чат
            </h3>
            <input
              type="text"
              className="
             bg-[#cdcdcd] text-black rounded-[5px]  font-bold  px-[.5rem] py-[.5rem] h-[35px]  relative  block w-[90%] mx-auto mt-[1.5rem] mb-[.5rem] text-[14px] outline-none  "
              value={queryContact}
              onChange={(e) => {
                setFiltContacts(
                  contacts.filter(
                    (el) =>
                      `${el?.name}`.includes(e.target.value) ||
                      `${el?.pushName}`.includes(e.target.value) ||
                      `${el?.number}`.includes(e.target.value)
                  )
                );
                setQueryContact(e.target.value);
              }}
            />
          </div>
          {showSpinner ? (
            <Spinner />
          ) : (
            <div className="relative p-2 ml-2 flex-auto text-center overflow-scroll h-[40vh]">
              {filtContacts?.map(
                (el) =>
                  el?.isWAContact && (
                    <div
                      className={`p-[1rem]  
          border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-[#59595f] ${
            el?.id === activeContact?.id && "bg-[#59595f]"
          }`}
                      onClick={() => {
                        setActiveContact(el);
                        // if (window.innerWidth < 768) {
                        //   setShowChats(false);
                        // }
                      }}
                    >
                      <div className="flex flex-col gap-1 text-[#e9e9e9] text-left w-[60%]">
                        <h3 className="text-lg md:text-md font-bold ml-[2rem]">
                          {el?.pushName ?? el?.name ?? "+" + el?.number}
                        </h3>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
          <div className="flex items-center justify-end py-[1rem] px-2 border-t border-solid border-[#2a2a2a] rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Отменить
            </button>
            <button
              className="text-white bg-primary font-bold uppercase text-sm px-6 py-3 rounded-[5px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => {
                setShowSpinner(true);

                const newChat = {
                  id: {
                    _serialized: activeContact.id,
                  },
                  name: activeContact.pushName ?? activeContact.name,
                  isGroup: false,
                  unreadCount: 0,
                  messages: [],
                  lastMessage: {
                    body: "",
                    fromMe: false,
                    timestamp: +(Date.now() + "").slice(0, -3),
                  },
                };

                setDataUser((prev) => ({
                  ...prev,
                  chats: {
                    ...prev.chats,
                    [session]: [...prev.chats[session], newChat],
                  },
                }));
                DatabaseAPI.updateUser(dataUser.username, {
                  chats: {
                    ...dataUser.chats,
                    [session]: [...dataUser.chats[session], newChat],
                  },
                }).then(() => {
                  setChats(
                    [...dataUser.chats[session], newChat]?.sort(
                      (chat1, chat2) => {
                        const chat1time =
                          +chat1?.lastMessage?.timestamp ||
                          +(chat1?.lastMessage?.payload?.timestamp + "000");
                        const chat2time =
                          +chat2?.lastMessage?.timestamp ||
                          +(chat2?.lastMessage?.payload?.timestamp + "000");

                        return chat1time > chat2time ? -1 : 1;
                      }
                    ) ?? []
                  );
                  setShowSpinner(false);
                  setShowModal(false);
                });
              }}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
