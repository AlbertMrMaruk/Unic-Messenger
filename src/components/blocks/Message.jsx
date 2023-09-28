function Message({ message }) {
  const url = message?.payload?.mediaUrl ?? message?.mediaUrl;
  const text = message?.payload?.body ?? message.body;
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
        />
      ) : (
        text
      )}
      {}
    </div>
  );
}

export default Message;
