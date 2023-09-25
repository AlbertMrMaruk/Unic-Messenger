import React from "react";

function Message({ message }) {
  console.log(message.payload);
  return (
    <div
      className={`mx-3 mb-2 rounded-xl  text-white px-3 py-2 max-w-[45%] w-fit ${
        message.event === "message"
          ? "bg-[#2a2a2e] self-start"
          : "bg-[#44a0ff] self-end"
      }`}
    >
      {message.payload.body}
    </div>
  );
}

export default Message;
