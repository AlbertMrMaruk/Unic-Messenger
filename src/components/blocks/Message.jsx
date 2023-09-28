function Message({ message }) {
  const url = message?.payload?.mediaUrl ?? message?.mediaUrl;
  const text = message?.payload?.body ?? message.body;
  const timestamp = message?.payload?.timestamp ?? message.timestamp;
  const calcDate = (timestamp) => {
    let h = new Date(timestamp).getHours();
    let m = new Date(timestamp).getMinutes();

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;

    return h + ":" + m;
  };
  return (
    <div
      className={`mx-3 mb-2 rounded-xl  text-white px-3 py-2 max-w-[45%] w-fit ${
        message.event === "message" || message.fromMe === false
          ? "bg-[#2a2a2e] self-start"
          : "bg-[#44a0ff] self-end"
      }`}
    >
      {console.log(message)}
      {url ? (
        <img
          src={"http://89.111.131.15" + url.slice(21)}
          alt="Image from user"
          className="max-w-[300px]"
        />
      ) : (
        text
      )}
      <span className="text-right">{calcDate(timestamp)}</span>
    </div>
  );
}

export default Message;
