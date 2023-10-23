import { useNavigate } from "react-router-dom";
import ChatsApi from "../../api/ChatsApi";
import DatabaseAPI from "../../api/DatabaseAPI";

function Chat({ chat, session, dataUser, setShowChats, index, currentChat }) {
  const calcDate = (timestamp) => {
    let h = new Date(
      chat?.lastMessage?.event === "send" ? +timestamp : +(timestamp + "000")
    ).getHours();
    let m = new Date(
      chat?.lastMessage?.event === "send" ? +timestamp : +(timestamp + "000")
    ).getMinutes();

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
                name: chat.name,
                img: chat.img ?? "",
              },
            });
          });
        } else {
          navigate("/", {
            state: {
              id: chat.id._serialized,
              name: chat.name,
              img: chat.img ?? "",
            },
          });
        }
      }}
    >
      <div className="bg-[#ababab] rounded-full md:w-[40px] md:h-[40px] w-[45px] h-[45px]">
        {chat.img && (
          <img
            src={chat.img}
            className="rounded-full w-[100%]"
            alt={chat.name}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 text-[#e9e9e9] text-left w-[60%]">
        <h3 className="text-lg md:text-md">{chat.name}</h3>
        <p className="text-[1rem] md:text-[0.85rem] text-[#777779]">
          {chat?.lastMessage?.fromMe ? "Вы: " : ""}
          {chat?.lastMessage?.body?.length > 20
            ? chat?.lastMessage?.body?.slice(0, 20) + "..."
            : chat?.lastMessage?.body}
        </p>
      </div>
      <div className="m-auto flex flex-col gap-[.4rem]">
        <p className="text-[1rem] md:text-[0.85rem] text-[#777779]">
          {calcDate(
            chat?.lastMessage?.timestamp ??
              chat?.lastMessage?.payload?.timestamp
          )}
        </p>
        {dataUser.chats[index]?.unreadCount !== 0 && (
          <div className="bg-[#44a0ff] text-white m-auto text-center px-[.6rem] py-[.1rem] ml-[.4rem] rounded-full text-[14px]  font-bold justify-end">
            {dataUser.chats[index]?.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
