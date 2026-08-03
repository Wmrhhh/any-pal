import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeepSeek } from '@lobehub/icons';
import { Ellipsis, Trash2, SquarePen, ArrowUpToLine } from 'lucide-react';
import { deleteConversation } from '../db/useChatDB'

interface ChatProps {
  id: number | undefined
  name: string,
  isSelected: boolean
  updatedAt: number
  onClick: () => void
}

export default function Chat({ id, name, isSelected, updatedAt, onClick }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();

  function toggleMenu(event: MouseEvent<SVGElement>) {
    event.stopPropagation();
    setIsOpen(!isOpen)
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (id === undefined) return;
    deleteConversation(id);
    if (isSelected) {
      navigate('/chat');
    }
    setIsOpen(false);
  }
  return (
    <div
      onClick={onClick}
      className={`relative flex w-full h-16 p-3 ${isSelected ? 'bg-[#19ac70]' : 'hover:bg-[#e2e2e4] dark:hover:bg-[#39393a]'
        } `}
    >
      <DeepSeek.Avatar size={40} className="items-center w-10 h-10 bg-white" />
      <div className='ml-3 grid grid-rows-[1fr_auto] w-30'>
        <h2 className={`${isSelected ? 'text-[#decae5]' : ''}text-[#181819] dark:text-[#e3e3e6] h-4 leading-none`}>{name}</h2>
        <p className={`${isSelected ? 'text-[#b9e6d4]' : 'text-[#818186]'} text-[12px] mb-0 pb-0 leading-none`}>探索未至之境</p>
      </div>
      <div className='ml-20 relative'>
        <span className={`ml-auto flex items-top ${isSelected ? 'text-[#b9e6d4]' : 'text-[#818186]'} leading-none text-[12px]`}>{(() => {
          if (!updatedAt) return "";
          const d = new Date(updatedAt);
          const h = String(d.getHours()).padStart(2, '0');
          const m = String(d.getMinutes()).padStart(2, '0');
          return `${h}:${m}`;
        })()}</span>
        <Ellipsis
          className='text-[#818186] hover:bg-[#1e1e1f] mt-2 rounded-md cursor-pointer'
          onClick={toggleMenu}
        />
        {isOpen &&
          <div
            className="absolute right-0 top-full z-50 mt-1 w-30 rounded-xl dark:bg-[#292929] bg-[#ffffff] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className='flex w-full rounded-t-xl items-center px-4 py-2 text-sm dark:text-[#dadada] text-[#333] dark:hover:bg-[#343434] hover:bg-[#f7f7f7]'
              onClick={() => setIsOpen(false)}
            >
              <SquarePen className='w-4 h-4 mr-3' />编辑标题
            </button>
            <button
              className='flex w-full items-center px-4 py-2 text-sm dark:text-[#dadada] text-[#333] dark:hover:bg-[#343434] hover:bg-[#f7f7f7]'
              onClick={() => setIsOpen(false)}
            >
              <ArrowUpToLine className='w-4 h-4 mr-3' />置顶
            </button>
            <button
              className='flex w-full rounded-b-xl items-center px-4 py-2 text-sm text-[#ff3849] dark:hover:bg-[#343434] hover:bg-[#f7f7f7]'
              onClick={handleDelete}
            >
              <Trash2 className='w-4 h-4 mr-3' />删除
            </button>
          </div>
        }
      </div>
      <div className={`absolute ${isSelected ? 'h-0' : 'bottom-0 left-3 right-3 h-0.5 bg-[#d9d9db] dark:bg-[#39393a]'}`} />
    </div>
  );
}