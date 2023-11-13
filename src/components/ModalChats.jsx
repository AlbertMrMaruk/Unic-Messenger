import { useLocation } from "react-router-dom";
import Spinner from "./blocks/Spinner";
import { useEffect, useState } from "react";
import ChatsApi from "../api/ChatsApi";

export default function ModalChats({ setShowModal, session }) {
  const { state } = useLocation();
  const [showSpinner, setShowSpinner] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState();
  useEffect(() => {
    ChatsApi.getContacts(session)
      .then((el) => el.json())
      .then((el) => {
        setContacts(el);
        setShowSpinner(false);
      });
  });

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,.7)]">
      <div className="relative my-6 mx-auto w-[90%] md:w-[50%]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondarylight outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-[#2a2a2a] rounded-t ">
            <h3 className="md:text-3xl font-bold text-white m-auto text-center md:text-left text-[1.65rem]">
              Новый чат
            </h3>
          </div>
          {showSpinner ? (
            <Spinner />
          ) : (
            <div className="relative p-2 ml-2 flex-auto text-center overflow-scroll h-[50vh]">
              {contacts?.slice(0, 30).map(
                (el) =>
                  el?.isWAContact && (
                    <div
                      className={`p-[1rem]  
          border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-secondarylight ${
            el?.id === activeContact?.id && "bg-secondarylight"
          }`}
                      onClick={() => {
                        setActiveContact(el);
                        // if (window.innerWidth < 768) {
                        //   setShowChats(false);
                        // }
                      }}
                    >
                      <div className="flex flex-col gap-1 text-[#e9e9e9] text-left w-[60%]">
                        <h3 className="text-lg md:text-md font-bold ml-[2rem]">
                          {el?.pushName ?? el?.name}
                        </h3>
                      </div>
                    </div>
                  )
              )}
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
                console.log("Oh yes", activeContact);
              }}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
