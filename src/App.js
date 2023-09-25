import Chats from "./pages/Chats";
import clickChat from "./api/controlers/ChatsController";
import { useEffect, useState } from "react";
function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => clickChat(setMessages), []);
  return <Chats messages={messages} setMessages={setMessages} />;
}

export default App;
