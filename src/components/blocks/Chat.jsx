import { useNavigate } from "react-router-dom";
import ChatsApi from "../../api/ChatsApi";
import DatabaseAPI from "../../api/DatabaseAPI";
import { formatDate } from "../../utils/utils";

function Chat({ chat, session, dataUser, setShowChats, index, currentChat }) {
  const calcDate = (timestamp) => {
    let h = new Date(+(timestamp + "000")).getHours();
    let m = new Date(+(timestamp + "000")).getMinutes();

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;

    return h + ":" + m;
  };
  const navigate = useNavigate();
  return (
    <div
      className={`p-[1rem]  
border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-secondarylight ${
        currentChat === chat.id._serialized && "bg-secondarylight"
      }`}
      data-id={chat.id._serialized}
      onClick={() => {
        if (window.innerWidth < 768) {
          setShowChats(false);
        }

        if (chat?.unreadCount > 0) {
          ChatsApi.sendSeen(chat.id._serialized, session);
          chat.unreadCount = 0;
          DatabaseAPI.updateUser(dataUser.username, {
            chats: dataUser.chats,
          }).then((res) => {
            console.log(res.status);
            navigate("/", {
              state: {
                id: chat.id._serialized,
                session,
                name: chat.name,
                img: chat.avatar ?? "",
              },
            });
          });
        } else {
          navigate("/", {
            state: {
              session,
              id: chat.id._serialized,
              name: chat.name,
              img: chat.avatar ?? "",
            },
          });
        }
      }}
    >
      <div className="bg-[#ababab] rounded-full md:w-[41px] md:h-[40px] w-[45px] h-[45px]">
        {chat.avatar && (
          <img
            src={chat.avatar}
            className="rounded-full w-[100%]"
            alt={chat.name}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 text-[#e9e9e9] text-left w-[52%]">
        <h3 className="text-lg md:text-md">{chat.name}</h3>
        <p className="text-[1rem] md:text-[0.85rem] text-[#777779]">
          {chat?.lastMessage?.fromMe ? "Вы: " : ""}
          {chat?.lastMessage?.body?.length > 20
            ? chat?.lastMessage?.body?.slice(0, 20) + "..."
            : chat?.lastMessage?.body}
        </p>
      </div>
      <div className="m-auto flex flex-col gap-[.4rem]">
        <p className="text-[.9rem] md:text-[0.85rem] text-[#777779]">
          {formatDate(+(chat?.lastMessage?.timestamp + "000")) === "Сегодня"
            ? calcDate(chat?.lastMessage?.timestamp)
            : formatDate(+(chat?.lastMessage?.timestamp + "000"))}
        </p>
        {dataUser.chats[session ?? dataUser.accounts[0]][index]?.unreadCount !==
          0 && (
          <div className="bg-[#44a0ff] text-white m-auto text-center px-[.6rem] py-[.1rem] ml-[.4rem] rounded-full text-[14px]  font-bold justify-end">
            {
              dataUser.chats[session ?? dataUser.accounts[0]][index]
                ?.unreadCount
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
