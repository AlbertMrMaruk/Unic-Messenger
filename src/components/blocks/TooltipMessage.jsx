import React, { useState } from "react";

export const TooltipMessage = ({ message, children }) => {
  const [show, setShow] = useState(false);
  console.log(message);
  return (
    <div
      className="relative flex flex-col items-center group w-[100%]"
      onContextMenu={() => setShow(!show)}
    >
      <div>{children}</div>
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center   ${
          !show ? "hidden" : null
        }`}
      >
        <span
          className={`relative z-10  text-xs leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3`}
        >
          <div className="flex flex-col gap-2 ">
            <span>Ответить на сообщение</span>
            <span className="text-red-500">Удалить сообщение</span>
          </div>
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
};
