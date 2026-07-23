import { MessageCircle } from 'lucide-react';
import { NotebookTabs } from 'lucide-react';
import { Settings } from 'lucide-react';
import { LogIn } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export default function ToolsList() {
  const messageCircle = useChatStore(state => state.conversationId)
  return (
    <div className="bg-[#2d2d2e]">
      <ul className='flex flex-col gap-2 mt-4'>
        <li className={`w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center }`}>
          <MessageCircle className={`w-5 h-5 ${messageCircle ? 'text-chat-accent' : 'text-[#b0b0b6]'}`} />
        </li>
        <li className='w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center'>
          <NotebookTabs className='w-5 h-5 text-[#b0b0b6]' />
        </li>
        <li className='w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center'>
          <LogIn className='w-5 h-5 text-[#b0b0b6]' />
        </li>
        <li className='w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center'>
          <Settings className='w-5 h-5 text-[#b0b0b6]' />
        </li>
      </ul>

    </div >
  )
}