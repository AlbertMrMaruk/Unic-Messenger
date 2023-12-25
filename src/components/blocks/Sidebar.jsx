import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaPlus, FaPen } from "react-icons/fa";
import Chat from "./Chat";
import Spinner from "./Spinner";

function Sidebar({
  onLoad,
  showChats,
  sizeUser,
  accounts,
  session,
  showSpinner,
  chats,
  setFiltChats,
  filtChats,
  currentChat,
  currentUser,
  setShowChats,
  setShowModalAccount,
  dataUser,
  setShowModalChats,
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`w-[100%] ${
        showChats ? "block" : "hidden"
      } overflow-hidden md:w-[28%] bg-inherit  border-r-[1px] border-[#2a2a2a] h-[100vh] p-[1rem] 
       `}
    >
      {/* Top menu */}
      <div className="flex  items-center pt-[.5rem] w-[100%] px-[1rem]  cursor-pointer">
        <div
          className="bg-white rounded-full w-[41px] h-[40px]"
          onClick={() => navigate("/profile")}
        >
          {currentUser?.img && (
            <img
              src={currentUser.img}
              className="rounded-full w-[100%]"
              alt={currentUser?.pushName}
            />
          )}
        </div>
        <h3
          className="font-bold text-white text-xl ml-[1.5rem]"
          onClick={() => navigate("/profile")}
        >
          {currentUser?.pushName ?? ""}
        </h3>
        {chats && (
          <div
            className="ml-[10rem] rounded-full bg-primary p-[0.65rem] cursor-pointer"
            onClick={() => setShowModalChats(true)}
          >
            <FaPen className="color-white bg-inherit w-[15px] h-[15px]" />
          </div>
        )}
      </div>

      {/* Choose messenger Block */}
      <div className="flex flex-col px-3 py-3 rounded-xl bg-secondarylight gap-1 mt-[1.5rem]">
        <h3 className="font-bold text-white text-xl text-center">
          Размер: {(sizeUser + " ").slice(0, 4) ?? ""} Мб
        </h3>
        {accounts.map((el, index) => (
          <div
            className={`p-[1rem]  
border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-[#3f4145] ${
              session === el ? "bg-[#3f4145]" : ""
            }`}
            key={index}
            onClick={() => {
              navigate("/", {
                state: {
                  session: el,
                },
              });
              onLoad(el);
            }}
          >
            <div className="rounded-full w-[40px] h-[40px] text-white ">
              <FaWhatsapp className="w-[40px] h-[40px]" />
            </div>
            <div className="flex flex-col gap-1 text-[#e9e9e9] text-left max-w-[75%]">
              <h3 className="text-md font-bold">WhatsApp Account</h3>
              <p className="text-[0.85rem] text-[#777779]">{el}</p>
            </div>
          </div>
        ))}
        <div
          className="m-auto rounded-full bg-primary p-[0.65rem] mt-[.5rem] cursor-pointer"
          onClick={() => setShowModalAccount(true)}
        >
          <FaPlus className="color-white bg-inherit w-[15px] h-[15px]" />
        </div>
      </div>
      {/* Chats */}
      <div
        className="flex flex-col
        items-center mt-[1rem] overflow-scroll h-[60vh]
         "
      >
        {showSpinner ? (
          <Spinner />
        ) : (
          <>
            <input
              type="text"
              placeholder="Поиск чата..."
              className=" py-[.75rem] px-[1rem] rounded-xl bg-secondarylight outline-none mb-[.75rem]  w-[100%]"
              onChange={(e) => {
                setFiltChats(
                  chats.filter(
                    (el) =>
                      `${el?.name}`.includes(e.target.value) ||
                      `${el?.pushName}`.includes(e.target.value) ||
                      `${el?.id._serialized.slice(0, -4)}`.includes(
                        e.target.value
                      )
                  )
                );
              }}
            />

            {(filtChats ?? chats)?.map((el, index) => (
              <Chat
                chat={el}
                currentChat={currentChat}
                key={index}
                index={index}
                setShowChats={setShowChats}
                session={session}
                dataUser={dataUser}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
