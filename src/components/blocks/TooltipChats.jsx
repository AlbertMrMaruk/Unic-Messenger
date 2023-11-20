import { useState } from "react";
import ChatsApi from "../../api/ChatsApi";
import DatabaseAPI from "../../api/DatabaseAPI";

export const TooltipChats = ({
  children,
  session,
  chatId,
  dataUser,
  setChats,
  setDataUser,
  chats,
  setMessages,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex flex-col  group  z-50"
      onClick={() => {
        console.log("gmgmg");
        setShow(!show);
      }}
    >
      {children}

      <div
        className={`absolute whitespace-nowrap top-full flex flex-col  items-center right-[-1rem]  ${
          !show ? "hidden" : ""
        }`}
      >
        <div className="w-3 h-3 -mb-[1.5rem] rotate-45 bg-secondarylight mt-[.5rem] ml-[11.5rem]" />
        <span
          className={`relative z-10 p-[.9rem] text-[.85rem] text-left leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3 mt-[1rem]`}
        >
          <div className="flex flex-col gap-3  font-bold ">
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                ChatsApi.deleteMessages(session, chatId).then((el) => {
                  console.log(el, "Deleted success");
                });
              }}
            >
              Удалить все сообщения в чате
            </span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                ChatsApi.deleteChat(session, chatId).then((el) => {
                  console.log(el, "Deleted success");
                });
              }}
            >
              Удалить чат
            </span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                ChatsApi.deleteChat(session, chatId).then(() => {
                  const newChats = chats.filter(
                    (el) => el.id._serialized !== chatId
                  );
                  setDataUser((prev) => ({
                    ...prev,
                    chats: { ...dataUser.chats, [session]: newChats },
                  }));

                  setChats(newChats);
                  DatabaseAPI.updateUser(dataUser.username, {
                    chats: { ...dataUser.chats, [session]: newChats },
                  });
                });
              }}
            >
              Удалить все сообщения и чат в приложении
            </span>
          </div>
        </span>
      </div>
    </div>
  );
};
