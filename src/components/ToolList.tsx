import { MessageCircle, NotebookTabs, Settings, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ToolList() {
  return (
    <div className="bg-[#dcdce1] dark:bg-[#2d2d2e]">
      <ul className="mt-4 flex flex-col gap-2">
        <Link to="/chat">
          <li className="mx-2 grid h-10 w-10 place-items-center rounded-lg hover:bg-[#d1d1d6] dark:hover:bg-[#373738]">
            <MessageCircle className="h-5 w-5 dark:text-[#b0b0b6] text-[#606062]" />
          </li>
        </Link>
        <li className="mx-2 grid h-10 w-10 place-items-center rounded-lg hover:bg-[#d1d1d6] dark:hover:bg-[#373738]">
          <NotebookTabs className="h-5 w-5 dark:text-[#b0b0b6] text-[#606062]" />
        </li>
        <li className="mx-2 grid h-10 w-10 place-items-center rounded-lg hover:bg-[#d1d1d6] dark:hover:bg-[#373738]">
          <LogIn className="h-5 w-5 dark:text-[#b0b0b6] text-[#606062]" />
        </li>
        <Link to="/settings">
          <li className="mx-2 grid h-10 w-10 place-items-center rounded-lg hover:bg-[#d1d1d6] dark:hover:bg-[#373738]">
            <Settings className="h-5 w-5 dark:text-[#b0b0b6] text-[#606062]" />
          </li>
        </Link>
      </ul>
    </div>
  );
}
