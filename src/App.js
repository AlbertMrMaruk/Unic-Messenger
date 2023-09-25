import Chats from "./pages/Chats";
import clickChat from "./api/controlers/ChatsController";
import { useMemo, useState } from "react";
function App() {
  const [messages, setMessages] = useState([]);
  useMemo(() => clickChat(setMessages));
  return <Chats messages={messages} setMessages={setMessages} />;
}

export default App;
