import ChatList from "./component/ChatList";
import RightContent from "./component/RightContent";
import ChatContent from "./component/ChatContent";
import "./App.css";
import { useState } from 'react';

interface chatDataProps {
  id: number,
  name: string,
}

function App() {

  const chatData: chatDataProps[] = [
    { id: 1, name: "DeepSeek", },
    { id: 2, name: "chatGPT", },
    { id: 3, name: "kimi", },
  ]

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-3">
      <ChatList
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        chatData={chatData}>
      </ChatList>
      {selectedChatId ? <ChatContent chatData={chatData} selectedChatId={selectedChatId}></ChatContent> : <RightContent></RightContent>}
    </div>
  );
}

export default App;