import React, { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";
import { FaMicrophone, FaPause, FaPlay } from "react-icons/fa";

function TooltipVoice({ children }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef(null);
  const timerRef = useRef(null);

  const audioElement = useRef(null);
  const paused = useRef(false);

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

  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex flex-col  group "
      onClick={() => {
        console.log("gmgmg");
        setShow(false);
        // const onClick = () => {
        //   setShow(false);
        //   window.removeEventListener("click", onClick);
        // };
        // window.addEventListener("click", onClick);
      }}
    >
      {children}
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center   ${
          !show ? "hidden" : null
        }`}
      >
        <div
          className={`p-4 rounded-md border ${
            recording ? "bg-red-200" : "bg-blue-200"
          }`}
        >
          <div className="flex items-center">
            {recording ? (
              <button
                onClick={stopRecording}
                className="text-4xl p-2 mr-4 text-red-500"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="text-4xl p-2 mr-4 text-blue-500"
              >
                <FaMicrophone />
              </button>
            )}
            {recording && (
              <div className="text-sm text-gray-600">{calcDur(duration)}</div>
            )}
          </div>
          {audioUrl && (
            <div className="flex items-center mt-4">
              {/* <div className="text-4xl text-blue-500 mr-4" onClick={toggleAudio}>
              {paused.current ? <FaPlay /> : <FaPause />}
            </div> */}
              <div className="flex flex-col">
                <audio
                  controls
                  src={audioUrl}
                  ref={audioElement}
                  onEnded={() => {
                    paused.current = false;
                  }}
                  className="audio-container custom-audio"
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
}

export default TooltipVoice;
