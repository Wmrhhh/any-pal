import '../App.css';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import SearchBox from './SearchBox'
import { useConversations } from '../hooks/useConversations';
import { useChatStore } from '../store/chatStore';

export default function ChatList() {
  const navigate = useNavigate();
  const conversations = useConversations();
  const conversationId = useChatStore((state) => state.conversationId);
  const setConversationId = useChatStore((state) => state.setConversationId);

  return (
    <div className="flex h-full min-h-0 w-80 shrink-0 flex-col bg-[#eeeef0] dark:bg-[#2f2f30]">
      <SearchBox />
      <div className="m-4 flex">
        <Activity className="mr-4 h-4 w-4 text-[#b0b0b6]" />
        <span className="dark:text-[#b0b0b6] text-[#68686d] leading-none">善医者无煌煌之名</span>
      </div>
      <div className="chat-list-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col">
          {conversations.map((chat) => (
            <Chat
              key={chat.id}
              id={chat.id}
              name={chat.name}
              isSelected={conversationId === chat.id}
              subtitle={chat.subtitle}
              updatedAt={chat.updatedAt}
              onClick={() => {
                if (conversationId === chat.id) {
                  setConversationId(null);
                  navigate('/chat');
                } else {
                  setConversationId(chat.id ?? null);
                  navigate(chat.id ? `/chat/${chat.id}` : '/chat');
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
