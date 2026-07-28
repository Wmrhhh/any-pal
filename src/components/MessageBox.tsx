import { ArrowUp } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface MessageProps {
  sendMessage: () => void;
  loading: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

export default function MessageBox({ sendMessage, loading, input, setInput }: MessageProps) {
  function submit() {
    sendMessage();
  }
  return (
    <div className="sticky flex flex-col justify-between bottom-0 w-full h-30 p-3 dark:bg-[#1e1e1f] bg-[#fafafa] border-[#e0e0e0] dark:text-[#e2e2e6] text-[#19191a] border-2 dark:border-[#39393a] rounded-xl ">
      <input
        type="text"
        value={input}
        placeholder="随便说点什么"
        onChange={e => setInput(e.target.value)}
        className="outline-none focus:ring-0"
      />
      <div className="flex justify-end">
        <button
          className={`grid place-items-center w-10 h-10 border dark:border-[#39393a] border-[#e0e0e0] rounded-full ${(!loading && input) ? 'dark:bg-[#e2e2e6]  dark:text-[#1e1e1f] bg-[#000000] text-[#e2e2e6]' : ''}`}
          onClick={submit}
        >
          <ArrowUp className="" />
        </button>
      </div>
    </div>
  );
}
