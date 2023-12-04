import React, { useState } from "react";
import ChatsApi from "../../api/ChatsApi";

export const TooltipMessage = ({
  message,
  children,
  session,
  setReplyMessage,
  setShowModalReply,
  isGroup,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex flex-col  group w-[100%]"
      onContextMenu={(e) => {
        e.preventDefault();
        const onClick = () => {
          setShow(false);
          window.removeEventListener("click", onClick);
        };
        window.addEventListener("click", onClick);
        setShow(!show);
      }}
    >
      {isGroup ? (
        <>
          <div className="flex flex-row items-center">
            <div className="bg-[#ababab]  rounded-full w-[40px] h-[40px]"></div>
            {children}
          </div>
        </>
      ) : (
        children
      )}

      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col  items-center ${
          message?.fromMe ? "right-[-1rem]" : "left-[-1rem]"
        }  ${!show ? "hidden" : ""}`}
      >
        <span
          className={`relative z-10  text-[.85rem] text-left leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3`}
        >
          <div className="flex flex-col gap-3  font-bold ">
            <div className="flex gap-1 border-b-2 border-[#3f4145] w-full p-[.7rem]">
              <div
                className=" rounded-full p-[.7rem] hover:bg-[#3f4145] bg-inherit text-[22px] cursor-pointer"
                onClick={() => {
                  ChatsApi.sendReaction(message?.id, "❤️", session);
                }}
              >
                ❤️
              </div>
              <div
                className=" rounded-full p-[.7rem] hover:bg-[#3f4145] bg-inherit text-[22px] cursor-pointer"
                onClick={() => {
                  ChatsApi.sendReaction(message?.id, "😍", session);
                }}
              >
                😍
              </div>

              <div
                className=" rounded-full p-[.7rem] hover:bg-[#3f4145] bg-inherit text-[22px] cursor-pointer "
                onClick={() => {
                  ChatsApi.sendReaction(message?.id, "👍", session);
                }}
              >
                👍
              </div>
              <div
                className=" rounded-full p-[.7rem] hover:bg-[#3f4145] bg-inherit text-[22px] cursor-pointer"
                onClick={() => {
                  ChatsApi.sendReaction(message?.id, "😂", session);
                }}
              >
                😂
              </div>
            </div>
            <span
              className=" cursor-pointer px-[.9rem]"
              onClick={() => {
                console.log(message);
                setReplyMessage(message);
              }}
            >
              Ответить на сообщение
            </span>
            <span
              className="cursor-pointer px-[.9rem]"
              onClick={async () => {
                await navigator.clipboard.writeText(message?.body);
              }}
            >
              Копировать сообщение
            </span>
            <span
              className="cursor-pointer px-[.9rem] pb-[.9rem]"
              onClick={() => {
                setReplyMessage(message);
                setShowModalReply(true);
              }}
            >
              Переслать сообщение
            </span>
          </div>
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
};
