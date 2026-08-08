import { MessageCircle, NotebookTabs, Settings, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react'

export default function ToolList() {
  const [activeItem, setActiveItem] = useState('chat')

  const itemClass = (name: string) => {
    return activeItem === name
      ? "h-5 w-5 dark:text-[#19ac70] text-[#19ac70]"
      : "h-5 w-5 dark:text-[#b0b0b6] text-[#606062]"
  };
  const liClass = "mx-2 grid h-10 w-10 place-items-center rounded-lg hover:bg-[#d1d1d6] dark:hover:bg-[#373738]"
  return (
    <div className="bg-[#dcdce1] dark:bg-[#2d2d2e]">
      <ul className="mt-4 flex flex-col gap-2">
        <Link to="/chat">
          <li
            className={liClass}
            onClick={() => setActiveItem('chat')}
          >
            <MessageCircle className={itemClass('chat')} />
          </li>
        </Link>
        <li
          className={liClass}
          onClick={() => setActiveItem('conv')}
        >
          <NotebookTabs className={itemClass('conv')} />
        </li>
        <li
          className={liClass}
          onClick={() => setActiveItem('login')}
        >
          <LogIn className={itemClass('login')} />
        </li>
        <Link to="/settings">
          <li
            className={liClass}
            onClick={() => setActiveItem('setting')}
          >
            <Settings className={itemClass('setting')} />
          </li>
        </Link>
      </ul>
    </div>
  );
}
