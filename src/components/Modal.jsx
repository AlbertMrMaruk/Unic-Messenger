import React from "react";

export default function Modal({ file, setShowModal }) {
  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,.7)]">
      <div className="relative my-6 mx-auto w-[50%]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#1c1d1f] outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-[#2a2a2a] rounded-t ">
            <h3 className="text-3xl font-bold text-white m-auto">
              Отправить файл
            </h3>
          </div>
          <div className="relative p-2 ml-2 flex-auto">
            <label className="block text-white text-md font-bold mb-1 ">
              Файл:
            </label>
            <img
              src={file}
              alt="File for send"
              className="w-[70%] h-[70%] m-auto"
            />
          </div>
          <div className="flex items-center justify-end p-2 border-t border-solid border-[#2a2a2a] rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Отменить
            </button>
            <button
              className="text-white bg-[#44a0ff]  font-bold uppercase text-sm px-6 py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
