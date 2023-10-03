import { useNavigate } from "react-router-dom";

function Chat({ chat }) {
  const navigate = useNavigate();
  return (
    <div
      className="p-[1rem]  
border-[#2a2a2a] w-[100%] rounded-xl flex items-center gap-6 cursor-pointer hover:bg-[#1f2022]"
      data-id={chat.id._serialized}
      onClick={() =>
        navigate("/", {
          state: {
            id: chat.id._serialized,
            name: chat.name,
            img: chat.img ?? "",
          },
        })
      }
    >
      <div className="bg-[#ababab] rounded-full w-[40px] h-[40px]">
        {chat.img && (
          <img
            src={chat.img}
            className="rounded-full w-[100%]"
            alt={chat.name}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 text-[#e9e9e9] text-left max-w-[75%]">
        <h3 className="text-md">{chat.name}</h3>
        <p className="text-[0.85rem] text-[#777779]">
          {chat.lastMessage.fromMe ? "Вы: " : ""}
          {chat.lastMessage.body.length > 20
            ? chat.lastMessage.body.split(0, 20) + "..."
            : chat.lastMessage.body}
        </p>
      </div>
    </div>
  );
}

export default Chat;
