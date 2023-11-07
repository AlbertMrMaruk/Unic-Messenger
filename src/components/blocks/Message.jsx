import { FaFilePdf } from "react-icons/fa";
const API_URL = "https://unicmessenger.ru";

function Message({ message }) {
  const url = message?.mediaUrl;
  const text = message?.body;
  const timestamp =
    +(message?.payload?.timestamp + "000") || +(message?.timestamp + "000");
  // const isGroup = message.
  const calcDate = (timestamp) => {
    let h = new Date(+timestamp).getHours();
    let m = new Date(+timestamp).getMinutes();

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;

    return h + ":" + m;
  };
  const isPdf = (url) => {
    return url?.split(".").at(-1) === "pdf";
  };
  const isVideo = (url) => {
    return url?.split(".").at(-1) === "mp4";
  };
  const isAudio = (url) => {
    return (
      url?.split(".").at(-1) === "oga" ||
      url?.split(".").at(-1) === "mp3" ||
      url?.split(".").at(-1) === "mpga"
    );
  };
  const isImg = (url) => {
    return url && !isVideo(url) && !isPdf(url) && !isAudio(url);
  };
  return (
    <div
      className={`mx-3 mb-2 rounded-xl  text-white pr-2 pl-3 min-w-[9%] py-2 max-w-[70%] md:max-w-[45%] w-fit flex flex-col gap-1 ${
        !message?.fromMe ? "bg-[#2a2a2e] self-start" : "bg-primary self-end"
      }`}
    >
      {/* Проверка файла на тип если пдф или видео */}
      {isVideo(url) && (
        <video
          controls
          className="max-w-[300px]"
          src={API_URL + url.slice(21)}
        />
      )}
      {isImg(url) && (
        <img
          src={API_URL + url.slice(21)}
          alt="Image from user"
          className="max-w-[300px]"
        />
      )}
      {isAudio(url) && (
        <audio controls src={url} className="mainaudio min-w-[40%]" />
      )}
      {text && (
        <span
          className={` ${
            !message?.fromMe ? "text-left mr-[2.5rem]" : "text-right mr-[2rem]"
          } `}
        >
          {isPdf(url, message) ? (
            <a href={API_URL + url.slice(21)} target="_blank" className="flex">
              <FaFilePdf className="text-primary text-[1.4rem] my-auto mr-[.5rem]" />
              {text}
            </a>
          ) : (
            text
          )}
        </span>
      )}
      {/* <span className={`font-bold`}></span> */}
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
