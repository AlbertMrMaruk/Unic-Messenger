import React, { useState } from "react";

export const TooltipMessage = ({
  message,
  children,
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
          className={`relative z-10 p-[.9rem] text-[.85rem] text-left leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3`}
        >
          <div className="flex flex-col gap-3  font-bold ">
            <div className="flex gap-1">
              <div className=" rounded-full p-3 hover:bg-[#ccc] bg-inherit">
                😘
              </div>
            </div>
            <span
              className=" cursor-pointer"
              onClick={() => {
                console.log(message);
                setReplyMessage(message);
              }}
            >
              Ответить на сообщение
            </span>
            <span
              className="cursor-pointer"
              onClick={async () => {
                await navigator.clipboard.writeText(message?.body);
              }}
            >
              Копировать сообщение
            </span>
            <span
              className="cursor-pointer"
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
