import React, { useState, useRef, useEffect } from "react";
import RecordRTC from "recordrtc";
import { FaMicrophone } from "react-icons/fa";
import lamejs from "lamejs";

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
        recorderRef.current = RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/wav",
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

  const getBase64 = (url, dataURL) => {
    const reader = new FileReader();
    reader.readAsDataURL(url);
    reader.onload = () => {
      console.log(url, reader.result.toString());
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      console.log(encoded);
      setAudioUrl({ url: dataURL, encoded });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  // const startRecording = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true })
  //     .then((stream) => {
  //       mediaRecorder.current = new MediaRecorder(stream, {
  //         mimeType: "audio/ogg; codecs=vorbis",
  //       });

  //       mediaRecorder.current.ondataavailable = (event) => {
  //         chunks.current.push(event.data);
  //       };
  //       timerRef.current = setInterval(() => {
  //         setDuration((prevDuration) => prevDuration + 1);
  //       }, 1000);
  //       mediaRecorder.current.onstop = () => {
  //         const blob = new Blob(chunks.current, {
  //           type: "audio/mpeg-3'; codecs=opus",
  //         });
  //         chunks.current = [];
  //         const audioURL = URL.createObjectURL(blob);
  //         console.log(blob, audioURL);
  //         getBase64(blob, audioURL);
  //       };
  //       setRecording(true);
  //       mediaRecorder.current.start();
  //     })
  //     .catch((err) => {
  //       console.error("Error accessing the microphone:", err);
  //     });
  // };

  const calcDur = (dur) => {
    let m = Math.floor(dur / 60);
    let s = dur - m * 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return m + ":" + s;
  };
  // const stopRecording = () => {
  //   if (mediaRecorder.current) {
  //     setRecording(false);

  //     mediaRecorder.current.stop();
  //   }
  //   console.log(show);
  //   setShow(false);
  // };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        clearInterval(timerRef.current);
        const audioBlob = recorderRef.current.getBlob();

        // const reader = new FileReader();
        // reader.onload = () => {
        //   let arrayBuffer = reader.result;

        //   // Pad the ArrayBuffer with a zero byte if it has an odd number of bytes
        //   if (arrayBuffer.byteLength % 2 === 1) {
        //     const paddedArrayBuffer = new ArrayBuffer(
        //       arrayBuffer.byteLength + 1
        //     );
        //     const paddedView = new Uint8Array(paddedArrayBuffer);
        //     paddedView.set(new Uint8Array(arrayBuffer));
        //     paddedView[arrayBuffer.byteLength] = 0;
        //     arrayBuffer = paddedArrayBuffer;
        //   }

        //   const wavData = new Int16Array(arrayBuffer);
        //   const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
        //   const mp3Data = mp3Encoder.encodeBuffer(wavData);
        //   mp3Encoder.flush();

        //   const mp3Blob = new Blob([new Int8Array(mp3Data)], {
        //     type: "audio/mpeg",
        //   });
        //   const mp3Url = URL.createObjectURL(mp3Blob);
        //   setAudioUrl(mp3Url);
        // };

        // reader.readAsArrayBuffer(audioBlob);

        // setRecording(false);
        // setShow(false);

        const url = URL.createObjectURL(audioBlob);
        console.log(url);
        recorderRef.current.getDataURL((dataURL) => {
          // You can save the dataURL to the server if needed.
          console.log(dataURL);
          let encoded = dataURL.replace(/^data:(.*,)?/, "");
          if (encoded.length % 4 > 0) {
            encoded += "=".repeat(4 - (encoded.length % 4));
          }
          setAudioUrl({ url, encoded });
        });
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
      }}
    >
      {children}
      <div
        className={`absolute whitespace-nowrap bottom-full flex flex-col items-center left-[-.7rem]   ${
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
                className="text-2xl p-2 text-primary"
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
