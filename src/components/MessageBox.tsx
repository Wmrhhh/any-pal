import { ArrowUp, Square, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from 'react'

interface MessageProps {
  sendMessage: () => void;
  stopGenerate: () => void;
  loading: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const MAX_TEXTAREA_HEIGHT = 140;

export default function MessageBox({ sendMessage, stopGenerate, loading, input, setInput }: MessageProps) {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  function submit() {
    sendMessage();
  }

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)
    el.style.height = `${nextHeight}px`
    el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden"
  }

  useEffect(() => {
    autoResize()
  }, [input])
  return (
    <div className="sticky flex flex-col justify-between min-h-30 bottom-0 w-full p-3 dark:bg-[#1e1e1f] bg-[#fafafa] border-[#e0e0e0] dark:text-[#e2e2e6] text-[#19191a] border-2 dark:border-[#39393a] rounded-xl ">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        placeholder="随便说点什么"
        onInput={autoResize}
        onChange={e => setInput(e.target.value)}
        onKeyDown={(e) => {
          // 监听回车键  避免Shift + Enter 被当成发送
          if (e.key === "Enter" && !e.shiftKey) {
            // 阻止默认提交/换行行为
            e.preventDefault();
            submit();
          }
        }}
        className="w-full resize-none bg-transparent pt-1 outline-none focus:ring-0 py-5"
        style={{
          maxHeight: `${MAX_TEXTAREA_HEIGHT}px`
        }}
      />
      <div className="flex justify-between items-end">
        <Plus className="place-items-center w-8 h-8" />
        <button
          className={`grid place-items-center w-10 h-10 border dark:border-[#39393a] border-[#e0e0e0] rounded-full ${(!loading && input) ? 'dark:bg-[#e2e2e6]  dark:text-[#1e1e1f] bg-[#000000] text-[#e2e2e6]' : ''}`}
          onClick={submit}
        >
          {loading ? <Square onClick={stopGenerate} /> : <ArrowUp />}
        </button>
      </div>
    </div>
  );
}
