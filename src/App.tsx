// import ChatList from "./component/chat/ChatList";
// import RightContent from "./component/chat/RightContent";
// import ChatContent from "./component/chat/ChatContent";
// import ToolsList from "./component/tool/ToolsList"
import "./App.css";
import { initDefaultConversations } from "./db/useChatDB"
import { useEffect } from 'react';
// import { useChatStore } from "./store/chatStore";
// import Set from './component/tool/Set'

function App() {

  // 

  useEffect(() => {
    initDefaultConversations()
  }, [])
  return
}

export default App;