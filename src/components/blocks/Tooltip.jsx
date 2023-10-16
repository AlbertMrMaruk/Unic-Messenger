import React, { useState } from "react";
import { FaFile, FaImage } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

export const Tooltip = ({
  setFile,
  children,
  setShowModal,
  setText,
  emoji,
}) => {
  const [show, setShow] = useState(false);
  const getBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      setFile({
        file: reader.result,
        encoded,
        name: file.name,
        type: file.type,
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
  const onEmojiClick = (emojiData) => {
    setText(
      (prev) =>
        prev + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
  };
  return (
    <div
      className="relative flex flex-col items-center group"
      onContextMenu={() => setShow(!show)}
      onClick={() => setShow(!show)}
    >
      <span className="flex justify-center">{children}</span>
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center   ${
          !show ? "hidden" : null
        }`}
      >
        <span
          className={`relative z-10 ${
            !emoji ? "p-4" : ""
          } text-xs leading-none text-white whitespace-no-wrap bg-secondarylight shadow-lg rounded-md flex gap-3`}
        >
          {emoji ? (
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              previewConfig={{}}
              height={350}
              width={300}
              searchDisabled
              skinTonesDisabled
              theme="dark"
            />
          ) : (
            <>
              <div className="flex flex-col gap-2 ">
                <FaFile className=" text-primary m-auto w-[25px] h-[25px]" />
                <span className="text-sm font-bold">Файл</span>
                <input
                  type="file"
                  className=" w-[35px] h-[70px] absolute opacity-0  cursor-pointer
            "
                  accept="image/png, image/jpeg"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <FaImage className="m-auto text-primary w-[25px] h-[25px]" />
                <span className="text-sm font-bold">Фото</span>

                <input
                  type="file"
                  className=" w-[35px] h-[70px] absolute opacity-0  cursor-pointer
            "
                  onClick={() => setShowModal(true)}
                  onChange={(e) => {
                    getBase64(e.target.files[0]);
                  }}
                  accept="image/png, image/jpeg"
                />
              </div>{" "}
            </>
          )}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
};
