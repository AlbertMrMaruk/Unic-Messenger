import React from "react";

function Message({ message }) {
  console.log(message);
  return (
    <div className="m-3 rounded-2xl bg-[#44a0ff] text-white px-3 py-2">
      {message.text}
    </div>
  );
}

export default Message;
