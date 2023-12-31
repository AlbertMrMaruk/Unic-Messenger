import { CircularProgressbar } from "react-circular-progressbar";
import ChatsApi from "../api/ChatsApi";

export default function ModalDownload({ session, percentage, setShowModal }) {
  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-[rgba(0,0,0,.7)]">
      <div className="relative my-6 mx-auto w-[90%] md:w-[50%]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondarylight outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-[#2a2a2a] rounded-t ">
            <h3 className="md:text-3xl font-bold text-white m-auto text-center md:text-left text-[1.65rem]">
              Загрузка чатов
            </h3>
          </div>
          <CircularProgressbar
            className="w-[40%] md:w-[20%] mx-auto my-[2rem] font-bold"
            value={percentage}
            text={`${percentage}%`}
            on
            styles={{
              // Customize the root svg element
              root: {},
              // Customize the path, i.e. the "completed progress"
              path: {
                // Path color
                stroke: `#44a0ff`,
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",
                // Customize transition animation
                transition: "stroke-dashoffset 0.5s ease 0s",
                // Rotate the path
                transform: "rotate(0.25turn)",
                transformOrigin: "center center",
              },
              // Customize the circle behind the path, i.e. the "total progress"
              trail: {
                // Trail color
                stroke: "#d6d6d6",
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",
                // Rotate the trail
                transform: "rotate(0.25turn)",
                transformOrigin: "center center",
              },
              // Customize the text
              text: {
                // Text color
                fill: "#fff",
                // Text size
                fontSize: "20px",
                fontWeight: 700,
                transform: "translateX(-18px) translateY(7px)",
              },
              // Customize background - only used when the `background` prop is true
              background: {
                fill: "#44a0ff",
              },
            }}
          />
          {percentage === 100 && (
            <button
              className="text-white bg-primary  font-bold uppercase text-sm px-6 py-3 rounded-[5px] shadow hover:shadow-lg outline-none focus:outline-none my-3 mx-auto"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                ChatsApi.stopSession(session).then(() =>
                  ChatsApi.startSession(session).then(() => setShowModal(false))
                );
              }}
            >
              Перейти к чатам
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
