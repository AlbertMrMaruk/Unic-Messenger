function Message({ message }) {
  return (
    <div
      className={`mx-3 mb-2 rounded-xl  text-white px-3 py-2 max-w-[45%] w-fit ${
        message.event === "message" || message.fromMe === false
          ? "bg-[#2a2a2e] self-start"
          : "bg-[#44a0ff] self-end"
      }`}
    >
      {message?.payload?.body ?? message.body}
    </div>
  );
}

export default Message;
