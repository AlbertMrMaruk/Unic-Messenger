function Message({ message }) {
  const url =
    message?.payload?.mediaUrl ??
    message?.mediaUrl ??
    message?.payload?.userMediaUrl;
  const text = message?.payload?.body ?? message.body;
  const timestamp = message?.payload?.timestamp ?? message.timestamp;
  const calcDate = (timestamp) => {
    let h = new Date(
      message?.payload?.userMediaUrl ? +timestamp : +(timestamp + "000")
    ).getHours();
    let m = new Date(
      message?.payload?.userMediaUrl ? +timestamp : +(timestamp + "000")
    ).getMinutes();

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;

    return h + ":" + m;
  };
  return (
    <div
      className={`mx-3 mb-2 rounded-xl  text-white pr-2 pl-3 min-w-[9%] py-2 max-w-[45%] w-fit flex flex-col gap-1 ${
        message.event === "message" || message.fromMe === false
          ? "bg-[#2a2a2e] self-start"
          : "bg-[#181d22] self-end"
      }`}
    >
      {url && (
        <img
          src={
            message?.payload?.userMediaUrl ||
            "http://89.111.131.15" + url.slice(21)
          }
          alt="Image from user"
          className="max-w-[300px]"
        />
      )}
      {text && (
        <span
          className={` ${
            message.event === "message" || message.fromMe === false
              ? "text-left mr-[2.5rem]"
              : "text-right mr-[2rem]"
          } `}
        >
          {text}
        </span>
      )}
      <span
        className={`text-right  mt-[-1.1rem] text-[10px]  ${
          url && !text
            ? "mt-[-1.8rem] p-[0.4rem] bg-[#2a2a2e52]"
            : " mt-[-1.1rem]"
        }`}
      >
        {calcDate(timestamp)}
      </span>
    </div>
  );
}

export default Message;
