import ChatList from "./component/ChatList";
import RightContent from "./component/RightContent";
import ChatContent from "./component/ChatContent";
import "./App.css";
import { useState } from 'react';

function App() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-3">
      <ChatList selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId}></ChatList>
      {selectedChatId ? <ChatContent></ChatContent> : <RightContent></RightContent>}
    </div>
  );
}

export default App;