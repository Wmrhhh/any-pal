import { MessageCircle } from 'lucide-react';
import { NotebookTabs } from 'lucide-react';
import { Settings } from 'lucide-react';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ToolsList() {
  return (
    <div className="bg-[#2d2d2e]">
      <ul className='flex flex-col gap-2 mt-4'>
        <Link to="/chat">
          <li
            className={`w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center`}
          // onClick={ }
          >
            <MessageCircle className={`w-5 h-5  text-[#b0b0b6]`} />
          </li>
        </Link>


        <li className='w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center'>
          <NotebookTabs className='w-5 h-5 text-[#b0b0b6]' />
        </li>
        <li className='w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center'>
          <LogIn className='w-5 h-5 text-[#b0b0b6]' />
        </li>
        <Link to="/settings">
          <li className='w-10 h-10 hover:bg-[#373738] rounded-lg mx-2 grid place-items-center'>
            <Settings
              className='w-5 h-5 text-[#b0b0b6]'
            />
          </li>
        </Link>
      </ul>
    </div >
  )
}