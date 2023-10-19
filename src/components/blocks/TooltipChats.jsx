import { useState } from "react";
import ChatsApi from "../../api/ChatsApi";
import DatabaseAPI from "../../api/DatabaseAPI";

export const TooltipChats = ({
  children,
  session,
  chatId,
  dataUser,
  setChats,
  chats,
  setMessages,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex flex-col  group "
      onClick={() => {
        console.log("gmgmg");
        setShow(!show);
        // const onClick = () => {
        //   setShow(false);
        //   window.removeEventListener("click", onClick);
        // };
        // window.addEventListener("click", onClick);
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
                  const chatIndex = chats.findIndex(
                    (el) => el.id._serialized === chatId
                  );
                  chats[chatIndex].lastMessage = {};
                  chats[chatIndex].messages = [];
                  setMessages([]);
                  DatabaseAPI.updateUser(dataUser.username, {
                    chats: dataUser.chats,
                  });
                });
              }}
            >
              Удалить все сообщения в чате
            </span>
            <span className="text-red-500 cursor-pointer">Удалить чат</span>
          </div>
        </span>
      </div>
    </div>
  );
};
