import Chats from "./pages/Chats";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { useState } from "react";
import Game from "./pages/Game";
import VoiceRecorder from "./pages/Test";

function App() {
  const [showApp, setShowApp] = useState(0);
  return (
    <>
      <VoiceRecorder />
      {/* {showApp === 3 ? (
        <Router>
          <Routes>
            <Route path="/" element={<Chats />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      ) : (
        <Game setShowApp={setShowApp} />
      )} */}
    </>
  );
}

export default App;
