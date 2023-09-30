import React, { useState } from "react";
import { FaFile, FaImage } from "react-icons/fa";

export const Tooltip = ({ children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col items-center group">
      <span
        className="flex justify-center"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center  group-hover:flex ${
          !show ? "hidden" : null
        }`}
      >
        <span className="relative z-10 p-4 text-xs leading-none text-white whitespace-no-wrap bg-[#1c1d1f] shadow-lg rounded-md flex gap-3">
          <div className="flex flex-col gap-2">
            <FaFile color="#44a0ff" />
            <span className="text-sm">Файл</span>
            <input
              type="file"
              className="invisible w-full
            "
            />
          </div>
          <div className="flex flex-col gap-2">
            <FaImage color="#44a0ff" />
            <span className="text-sm">Фото</span>
            <input
              type="file"
              className="invisible w-full
            "
            />
          </div>
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-[#1c1d1f] mb-2" />
      </div>
    </div>
  );
};
