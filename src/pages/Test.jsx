import React, { useState, useRef } from "react";
import { ReactMic } from "react-mic";

function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioPlayerRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedData) => {
    // Do something with the recorded audio data if needed
  };

  const onStop = (recordedData) => {
    setAudioBlob(recordedData.blob);
  };

  const playAudio = () => {
    if (audioBlob) {
      audioPlayerRef.current.src = URL.createObjectURL(audioBlob);
      audioPlayerRef.current.play();
    }
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
      />
      <div>
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        <button onClick={playAudio}>Play Recorded Audio</button>
      </div>
      <audio ref={audioPlayerRef} controls />
    </div>
  );
}

export default VoiceRecorder;
