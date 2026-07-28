import { DeepSeek } from '@lobehub/icons';

interface ChatProps {
  name: string,
  isSelected: boolean
  updatedAt: number
  onClick: () => void
}

export default function Chat({ name, isSelected, onClick }: ChatProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex w-full h-16 p-3 ${isSelected ? 'bg-[#19ac70]' : 'hover:bg-[#e2e2e4] dark:hover:bg-[#39393a]'
        } `}
    >
      <DeepSeek.Avatar size={40} className="items-center w-10 h-10 bg-white" />
      <div className='ml-3 grid grid-rows-[1fr_auto]'>
        <h2 className={`${isSelected ? 'text-[#decae5]' : ''}text-[#181819] dark:text-[#e3e3e6] h-4 leading-none`}>{name}</h2>
        <p className={`${isSelected ? 'text-[#b9e6d4]' : 'text-[#818186]'} text-[12px] mb-0 pb-0 leading-none`}>探索未至之境</p>
      </div>
      <span className={`ml-auto flex items-top ${isSelected ? 'text-[#b9e6d4]' : 'text-[#818186]'} text-[#818186] leading-none text-[12px]`}>time</span>
      <div className={`absolute ${isSelected ? 'h-0' : 'bottom-0 left-3 right-3 h-0.5 bg-[#d9d9db] dark:bg-[#39393a]'}`} />
    </div>
  );
}