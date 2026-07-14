import '../App.css';
import { Activity } from 'lucide-react'
import { useState } from 'react';
import Chat from './Chat'

interface chatDataProps {
  id: number,
  name: string,
}

export default function ChatList() {

  const chatData: chatDataProps[] = [
    { id: 1, name: "DeepSeek", },
    { id: 2, name: "chatGPT", },
    { id: 3, name: "kimi", },
  ]

  const [selectedId, setSelectId] = useState<number | null>(null)



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
              <Chat key={chat.id} name={chat.name} isSelected={selectedId === chat.id} onClick={() => setSelectId(selectedId === chat.id ? null : chat.id)}></Chat>
            ))
          }
        </div>
      </div>
    </>
  )
}