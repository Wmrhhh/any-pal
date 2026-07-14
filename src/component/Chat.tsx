import { DeepSeek } from '@lobehub/icons';
import type { Dispatch, SetStateAction } from 'react';

interface ChatProps {
  isBgChange: boolean;
  setIsBgChange: Dispatch<SetStateAction<boolean>>;
}

export default function Chat({ isBgChange, setIsBgChange }: ChatProps) {

  return (
    <div
      className={`relative flex w-full h-16 p-3 ${isBgChange ? 'bg-[#19ac70]' : 'bg-[#2f2f30] hover:bg-[#39393a]'
        } `}
      onClick={() => setIsBgChange(!isBgChange)}
    >
      <DeepSeek.Avatar size={40} className="items-center w-10 h-10 bg-white" />
      <div className='ml-3 grid grid-rows-[1fr_auto]'>
        <h2 className='text-[#e2e2e6] h-4 leading-none'>DeepSeek</h2>
        <p className={`${isBgChange ? 'text-[#b9e6d4]' : 'text-[#818186]'} text-[12px] mb-0 pb-0 leading-none`}>探索未至之境</p>
      </div>
      <span className={`ml-auto flex items-top ${isBgChange ? 'text-[#b9e6d4]' : 'text-[#818186]'} text-[#818186] leading-none text-[12px]`}>time</span>
      <div className={`absolute ${isBgChange ? 'h-0' : 'bottom-0 left-3 right-3 h-0.5 bg-[#39393a]'}`} />
    </div>
  );
}

