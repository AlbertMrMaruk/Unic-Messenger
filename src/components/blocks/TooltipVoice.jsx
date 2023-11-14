import React, { useState, useRef, useEffect } from "react";
// import Recorder from "react-mp3-recorder";
import Recorder from "./Recorder";

import { FaMicrophone } from "react-icons/fa";

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function TooltipVoice({ children, setAudioUrl }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);
  const recorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        let chunks = [];
        recorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        recorderRef.current.ondataavailable = function (e) {
          chunks.push(e.data);
        };

        recorderRef.current.onstop = function (e) {
          const blob = new Blob(chunks, { type: "audio/webm" });

          chunks = [];

          setRecording(false);
        };

        recorderRef.current.start();

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
    } else {
      console.error("Recorder is not defined.");
    }
  };

  useEffect(() => {
    if (!recording) {
      setDuration(0);
    }
  }, [recording]);

  const onRecordingComplete = async (blob) => {
    const url = URL.createObjectURL(blob);
    const dataURL = await blobToBase64(blob);

    let encoded = dataURL.replace(/^data:(.*,)?/, "");
    if (encoded.length % 4 > 0) {
      encoded += "=".repeat(4 - (encoded.length % 4));
    }
    console.log("recording", encoded);
    setAudioUrl({ url, encoded });
    setShow(false);
  };

  const onRecordingError = (err) => {
    console.log("recording error", err);
  };

  return (
    <div
      className="relative flex flex-col  group "
      onClick={() => {
        console.log("gmgmg");
        setShow(true);
      }}
    >
      {children}

      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center left-[-.7rem]   ${
          !show ? "hidden" : null
        }`}
      >
        <Recorder
          onRecordingComplete={onRecordingComplete}
          onRecordingError={onRecordingError}
        />
        {/* <div
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
                className="text-2xl p-2 text-primary"
              >
                <FaMicrophone />
              </button>
            )}
            {recording && (
              <div className="text-sm text-gray-600">{calcDur(duration)}</div>
            )}
          </div>
        </div> */}
        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
}

export default TooltipVoice;
