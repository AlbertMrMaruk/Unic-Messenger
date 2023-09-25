import Chats from "./pages/Chats";
import clickChat from "./api/controlers/ChatsController";
import { useState } from "react";
function App() {
  const [messages, setMessages] = useState([]);
  clickChat(setMessages);
  return <Chats messages={messages} setMessages={setMessages} />;
}

export default App;
