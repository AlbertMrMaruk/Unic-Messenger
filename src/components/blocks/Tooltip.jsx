import React, { useState } from "react";
import { FaFile, FaImage } from "react-icons/fa";

export const Tooltip = ({ children }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex flex-col items-center group"
      onClick={() => setShow(!show)}
    >
      <span className="flex justify-center">{children}</span>
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center   ${
          !show ? "hidden" : null
        }`}
      >
        <span className="relative z-10 p-4 text-xs leading-none text-white whitespace-no-wrap bg-[#1c1d1f] shadow-lg rounded-md flex gap-3">
          <div className="flex flex-col gap-2 ">
            <FaFile color="#44a0ff" className="m-auto w-[25px] h-[25px]" />
            <span className="text-sm font-bold">Файл</span>
            <input
              type="file"
              className=" w-[35px] h-[70px] absolute opacity-0  cursor-pointer
            "
              accept="image/png, image/jpeg"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <FaImage color="#44a0ff" className="m-auto w-[25px] h-[25px]" />
            <span className="text-sm font-bold">Фото</span>
            <input
              type="file"
              className=" w-[35px] h-[70px] absolute opacity-0  cursor-pointer
            "
              accept="image/png, image/jpeg"
            />
          </div>
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-[#1c1d1f] mb-2" />
      </div>
    </div>
  );
};
