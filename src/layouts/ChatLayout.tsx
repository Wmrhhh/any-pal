import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import ChatList from "../components/ChatList";
import { useChatStore } from "../store/chatStore";

export default function ChatLayout() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const setConversationId = useChatStore((state) => state.setConversationId);

  useEffect(() => {
    const parsedId = conversationId ? Number(conversationId) : null;
    setConversationId(
      Number.isNaN(parsedId as number) ? null : (parsedId as number | null),
    );
  }, [conversationId, setConversationId]);

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <ChatList />
      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
