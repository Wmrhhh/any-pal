import '../App.css';
import { Activity } from 'lucide-react'
import Chat from './Chat'

interface chatDataProps {
  id: number,
  name: string,
}
interface ChatListProps {
  selectedChatId: number | null,
  setSelectedChatId: (id: number | null) => void,
  chatData: chatDataProps[],
}

export default function ChatList({ selectedChatId, setSelectedChatId, chatData }: ChatListProps) {

  return (
    <>
      <div className='bg-[#2f2f30] min-h-screen'>
        <div className="flex m-4">
          <Activity className='w-4 h-4 text-[#b0b0b6] mr-4' />
          <span className='text-[#b0b0b6] leading-none'>善医者无煌煌之名</span>
        </div>
        <div className='flex flex-col'>
          {
            chatData.map((chat) => (
              <Chat
                key={chat.id}
                name={chat.name}
                isSelected={selectedChatId === chat.id}
                onClick={() => setSelectedChatId(selectedChatId === chat.id ? null : chat.id)}
              ></Chat>
            ))
          }
        </div>
      </div>
    </>
  )
}