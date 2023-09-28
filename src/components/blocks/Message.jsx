function Message({ message }) {
  return (
    <div
      className={`mx-3 mb-2 rounded-xl  text-white px-3 py-2 max-w-[45%] w-fit ${
        message.event === "message" || message.fromMe === false
          ? "bg-[#2a2a2e] self-start"
          : "bg-[#44a0ff] self-end"
      }`}
    >
      {console.log(message)}
      {message?.payload?.mediaUrl ? (
        <img src={message?.payload?.mediaUrl} alt="Image from user" />
      ) : (
        message?.payload?.body ?? message.body
      )}
      {}
    </div>
  );
}

export default Message;
