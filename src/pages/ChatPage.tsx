import ToolsList from "../component/tool/ToolsList"
import RightContent from "../component/chat/RightContent"
import ChatList from "../component/chat/ChatList"
import ChatContent from "../component/chat/ChatContent"
import { useChatStore } from "../store/chatStore";

export default function ChatPage() {
  const selectedChatId = useChatStore((state) => state.conversationId)
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <ToolsList />
        <ChatList />
        {selectedChatId ? <ChatContent></ChatContent> : <RightContent />}
      </div>
    </>
  )
}