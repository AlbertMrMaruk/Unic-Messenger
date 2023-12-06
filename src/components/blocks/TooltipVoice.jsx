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
  const [show, setShow] = useState(false);

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
      onClick={() => setShow(!show)}
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

        <div className="w-3 h-3 -mt-2 rotate-45 bg-secondarylight mb-2" />
      </div>
    </div>
  );
}

export default TooltipVoice;
