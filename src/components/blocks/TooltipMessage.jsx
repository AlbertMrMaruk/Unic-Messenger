import React, { useState } from "react";

export const TooltipMessage = ({ message, children }) => {
  const [show, setShow] = useState(false);
  console.log(message);
  return (
    <div
      className="relative flex flex-col  group w-[100%]"
      onContextMenu={() => {
        setShow(!show);
        return false;
      }}
    >
      {children}
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col  items-center ${
          message?.event === "message" || message?.fromMe
            ? "right-[-1rem]"
            : "left-[-1rem]"
        }  ${!show ? "hidden" : null}`}
      >
        <span
          className={`relative z-10 p-[.9rem] text-[.85rem] text-left leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3`}
        >
          <div className="flex flex-col gap-3  font-bold ">
            <span className=" cursor-pointer">Ответить на сообщение</span>
            <span className="text-red-500 cursor-pointer">
              Удалить сообщение
            </span>
          </div>
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
};
