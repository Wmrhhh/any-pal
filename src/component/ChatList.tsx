import '../App.css';
import { Activity } from 'lucide-react'
import { useState } from 'react';
import Chat from './Chat'

export default function ChatList() {
  const [isBgChange, setIsBgChange] = useState(false);
  return (
    <>
      <div className='bg-[#2f2f30] min-h-screen'>
        <div className="flex m-4">
          <Activity className='w-4 h-4 text-[#b0b0b6] mr-4' />
          <span className='text-[#b0b0b6] leading-none'>善医者无煌煌之名</span>
        </div>
        <div className='flex flex-col'>
          <Chat isBgChange={isBgChange} setIsBgChange={setIsBgChange}></Chat>
        </div>
      </div>
    </>
  )
}