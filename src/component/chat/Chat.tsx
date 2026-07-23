import { DeepSeek } from '@lobehub/icons';

interface ChatProps {
  name: string,
  updatedAt: number
  isSelected: boolean
  onClick: () => void
}

export default function Chat({ name, updatedAt, isSelected, onClick }: ChatProps) {
  const updatedDate = new Date(updatedAt);
  const hours = String(updatedDate.getHours()).padStart(2, '0');
  const minutes = String(updatedDate.getMinutes()).padStart(2, '0');

  return (
    <div
      onClick={onClick}
      className={`relative flex w-25vm h-16 p-3 ${isSelected ? 'bg-chat-accent' : 'bg-chat-bg-secondary hover:bg-[#39393a]'
        } `}
    >
      <DeepSeek.Avatar size={40} className="items-center w-10 h-10 bg-white" />
      <div className='ml-3 grid grid-rows-[1fr_auto]'>
        <h2 className='text-chat-text h-4 leading-none'>{name}</h2>
        <p className={`${isSelected ? 'text-[#b9e6d4]' : 'text-chat-muted'} text-[12px] mb-0 pb-0 leading-none`}>探索未至之境</p>
      </div>
      <span className={`ml-auto flex items-top ${isSelected ? 'text-[#b9e6d4]' : 'text-chat-muted'} text-chat-muted leading-none text-[12px]`}>{hours}:{minutes}</span>
      <div className={`absolute ${isSelected ? 'h-0' : 'bottom-0 left-3 right-3 h-0.5 bg-[#39393a]'}`} />
    </div>
  );
}