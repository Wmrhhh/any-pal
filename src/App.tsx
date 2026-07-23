import ChatList from "./component/chat/ChatList";
import RightContent from "./component/chat/RightContent";
import ChatContent from "./component/chat/ChatContent";
import ToolsList from "./component/ToolsList"
import "./App.css";
import { initDefaultConversations } from "./db/useChatDB"
import { useEffect } from 'react';
import { useChatStore } from "./store/chatStore";

function App() {

  const selectedChatId = useChatStore((state) => state.conversationId)

  useEffect(() => {
    initDefaultConversations()
  }, [])
  return (
    <div className="flex h-screen overflow-hidden">
      <ToolsList></ToolsList>
      <ChatList>
      </ChatList>
      {selectedChatId ? <ChatContent></ChatContent> : <RightContent />}
    </div >
  );
}

export default App;