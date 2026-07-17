import ChatList from "./component/ChatList";
import RightContent from "./component/RightContent";
import ChatContent from "./component/ChatContent";
import "./App.css";
import { initDefaultConversations } from "./db/useChatDB"
import { useState, useEffect } from 'react';

function App() {

  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)

  useEffect(() => {
    initDefaultConversations()
  }, [])
  return (
    <div className="grid md:grid-cols-3">
      <ChatList
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      >
      </ChatList>
      {selectedChatId ? <ChatContent conversationId={selectedChatId}></ChatContent> : <RightContent />}
    </div >
  );
}

export default App;