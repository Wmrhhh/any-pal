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
    <div className="shrink-0 flex flex-col justify-between m-3 mt-0 h-30 p-3 bg-chat-bg text-chat-text border-2 border-[#39393a] rounded-xl ">
      <input
        type="text"
        value={input}
        placeholder="随便说点什么"
        onChange={e => setInput(e.target.value)}
        className="outline-none focus:ring-0"
        onKeyDown={e => {
          // e.shiftKey允许 shift + enter 换行
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // 阻止默认换行
            submit();
          }
        }}
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
