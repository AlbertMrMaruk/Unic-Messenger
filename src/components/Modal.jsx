import { useLocation } from "react-router-dom";
import Spinner from "./blocks/Spinner";
import { useState } from "react";

export default function Modal({
  sendMessage,
  session,
  file,
  text,
  setShowModal,
}) {
  const { state } = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);
  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,.7)]">
      <div className="relative my-6 mx-auto w-[90%] md:w-[50%]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondarylight outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-[#2a2a2a] rounded-t ">
            <h3 className="md:text-3xl font-bold text-white m-auto text-center md:text-left text-[1.65rem]">
              Отправить файл
            </h3>
          </div>
          {showSpinner ? (
            <Spinner />
          ) : (
            <div className="relative p-2 ml-2 flex-auto text-center">
              <label className="block text-white text-md font-bold mb-1 ">
                Файл
              </label>
              <img
                src={file.file}
                alt="File for send"
                className="w-[40%]  mx-auto my-3"
              />
            </div>
          )}
          <div className="flex items-center justify-end py-[1rem] px-2 border-t border-solid border-[#2a2a2a] rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Отменить
            </button>
            <button
              className="text-white bg-primary font-bold uppercase text-sm px-6 py-3 rounded-[5px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => {
                setShowSpinner(true);
                sendMessage(text, "img", {
                  chatId: state?.id,
                  file: {
                    mimetype: file.type,
                    filename: file.name,
                    data: file.encoded,
                  },
                  caption: text,
                  session,
                }).then(() => {
                  setShowSpinner(false);
                  setShowModal(false);
                });
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
