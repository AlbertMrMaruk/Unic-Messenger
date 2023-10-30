import React, { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";
import { FaMicrophone } from "react-icons/fa";

function TooltipVoice({ children, setAudioUrl }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [show, setShow] = useState(false);
  const recorderRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorderRef.current = RecordRTC(stream, {
          type: "audio",
        });

        recorderRef.current.startRecording();
        setRecording(true);

        timerRef.current = setInterval(() => {
          setDuration((prevDuration) => prevDuration + 1);
        }, 1000);
      })
      .catch((error) =>
        console.error("Error accessing the microphone:", error)
      );
  };

  const calcDur = (dur) => {
    let m = Math.floor(dur / 60);
    let s = dur - m * 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return m + ":" + s;
  };
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        clearInterval(timerRef.current);
        const audioBlob = recorderRef.current.getBlob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        recorderRef.current.getDataURL((dataURL) => {
          // You can save the dataURL to the server if needed.
        });

        setRecording(false);
        setShow(false);
      });
    } else {
      console.error("Recorder is not defined.");
    }
  };

  // const toggleAudio = () => {
  //   if (audioElement.current) {
  //     if (audioElement.current.paused || audioElement.current.ended) {
  //       audioElement.current.play();
  //       paused.current = false;
  //     } else {
  //       audioElement.current.pause();
  //       paused.current = true;
  //     }
  //   }
  // };

  useEffect(() => {
    if (!recording) {
      setDuration(0);
    }
  }, [recording]);

  return (
    <div
      className="relative flex flex-col  group "
      onClick={() => {
        console.log("gmgmg");
        setShow(true);
        // const onClick = () => {
        //   setShow(false);
        //   window.removeEventListener("click", onClick);
        // };
        // window.addEventListener("click", onClick);
      }}
    >
      {children}
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center left-[-1.2rem]   ${
          !show ? "hidden" : null
        }`}
      >
        <div
          className={`p-2 rounded-md  bg-secondarylight
          }`}
        >
          <div className="flex items-center flex-col gap-2">
            {recording ? (
              <button
                onClick={stopRecording}
                className="text-2xl p-2 text-red-500"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="text-4xl p-2 text-primary"
              >
                <FaMicrophone />
              </button>
            )}
            {recording && (
              <div className="text-sm text-gray-600">{calcDur(duration)}</div>
            )}
          </div>
        </div>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
}

export default TooltipVoice;
