import '../App.css';
import { Activity } from 'lucide-react'
import Chat from './Chat'
import { useConversations } from '../db/useChatDB';
import type { Dispatch, SetStateAction } from 'react';

interface ChatListProps {
  selectedChatId: number | null,
  setSelectedChatId: Dispatch<SetStateAction<number | null>>,
}

export default function ChatList({ selectedChatId, setSelectedChatId }: ChatListProps) {

  const conversations = useConversations()
  return (
    <>
      <div className='bg-[#2f2f30] min-h-screen'>
        <div className="flex m-4">
          <Activity className='w-4 h-4 text-[#b0b0b6] mr-4' />
          <span className='text-[#b0b0b6] leading-none'>善医者无煌煌之名</span>
        </div>
        <div className='flex flex-col'>
          {
            conversations.map((chat) => (
              <Chat
                key={chat.id}
                name={chat.name}
                isSelected={selectedChatId === chat.id}
                onClick={() => {
                  setSelectedChatId((current) => {
                    if (current === chat.id) {
                      return null;
                    }
                    return chat.id ?? null;
                  });
                }}
              ></Chat>
            ))
          }
        </div>
      </div>
    </>
  )
}