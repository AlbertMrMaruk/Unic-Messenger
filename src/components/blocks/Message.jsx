import React from "react";

function Message({ message }) {
  console.log(message.payload);
  return (
    <div className="mx-3 mb-2 rounded-xl bg-[#44a0ff] text-white px-3 py-2 max-w-[45%] w-fit">
      {message.payload.body}
    </div>
  );
}

export default Message;
