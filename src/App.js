import Chats from "./pages/Chats";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  // const [messages, setMessages] = useState([]);
  // useEffect(() => clickChat(setMessages), []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chats />} />
      </Routes>
    </Router>
  );
}

export default App;
