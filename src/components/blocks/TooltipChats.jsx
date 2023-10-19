import { useState } from "react";

export const TooltipChats = ({ children }) => {
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
        <span
          className={`relative z-10 p-[.9rem] text-[.85rem] text-left leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3`}
        >
          <div className="flex flex-col gap-3  font-bold ">
            <span className="text-red-500 cursor-pointer">
              Удалить все сообщения в чате
            </span>
            <span className="text-red-500 cursor-pointer">Удалить чат</span>
          </div>
        </span>
        <div className="w-3 h-3 -mb-2 rotate-90 bg-secondarylight mt-2" />
      </div>
    </div>
  );
};
