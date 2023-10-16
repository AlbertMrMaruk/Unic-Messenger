import React, { useState } from "react";

export const TooltipMessage = ({ message, children }) => {
  const [show, setShow] = useState(false);
  console.log(message);
  const fromMe = message?.event === "send" || message?.fromMe;

  return (
    <div
      className="relative flex flex-col  group w-[100%]"
      onContextMenu={(e) => {
        e.preventDefault();
        const onClick = () => {
          console.log("gmm");
          setShow(!show);
          window.removeEventListener("click", onClick);
        };
        window.addEventListener("click", onClick);
        setShow(!show);
      }}
    >
      {children}
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col  items-center ${
          fromMe ? "right-[-1rem]" : "left-[-1rem]"
        }  ${!show ? "hidden" : ""}`}
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
