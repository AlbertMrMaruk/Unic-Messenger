import Chats from "./pages/Chats";
import clickChat from "./api/controlers/ChatsController";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => clickChat(setMessages), []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Chats messages={messages} setMessages={setMessages} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
