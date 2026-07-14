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
    <div className="sticky flex flex-col justify-between bottom-0 w-full h-30 p-3 bg-[#1e1e1f] text-[#e2e2e6] border-2 border-[#39393a] rounded-xl ">
      <input
        type="text"
        value={input}
        placeholder="随便说点什么"
        onChange={e => setInput(e.target.value)}
        className="outline-none focus:ring-0"
      />
      <div className="flex justify-end">
        <button
          className={`grid place-items-center w-10 h-10 border border-[#39393a] rounded-full ${(!loading && input) ? 'bg-[#e2e2e6] text-[#1e1e1f]' : ''}`}
          onClick={submit}
        >
          <ArrowUp className="" />
        </button>
      </div>
    </div>
  );
}
