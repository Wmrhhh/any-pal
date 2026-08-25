import { ArrowUp, Square, ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from 'react'
import { useChatStore } from "../store/chatStore";
import { updateCurrentModel } from "../db/useChatDB";

interface MessageProps {
  sendMessage: () => void;
  stopGenerate: () => void;
  loading: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

const MAX_TEXTAREA_HEIGHT = 140;
const MODEL_OPTIONS = [
  {
    model: "DeepSeek-v4-flash",
    displayName: "DeepSeek v4 Flash",
  },
  {
    model: "Kimi-k2.6",
    displayName: "kimi k2.6",
  }
]


export default function MessageBox({ sendMessage, stopGenerate, loading, input, setInput }: MessageProps) {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const currentModels = useChatStore((state) => state.currentModels)
  const setCurrentModel = useChatStore((state) => state.setCurrentModels)
  const conversationId = useChatStore(state => state.conversationId)
  const [isChoiceModel, setIsChoiceModel] = useState(false)

  const currentModel = conversationId === null ? "DeepSeek-v4-flash" : currentModels[conversationId] ?? "DeepSeek-v4-flash"

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

  // 根据Zustand内的currentModel从MODEL_OPTIONS内寻找对应的，然后显示displayName
  const currentModelOpen = MODEL_OPTIONS.find((option) => option.model === currentModel)

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
      <div className="flex justify-between items-end gap-3">

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsChoiceModel(prev => !prev)}
              className="flex w-48 items-center justify-between gap-2 rounded-full border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 text-sm font-medium text-[#19191a] shadow-sm transition hover:bg-[#eeeeef] dark:border-[#39393a] dark:bg-[#232324] dark:text-[#e2e2e6] dark:hover:bg-[#2a2a2b]"
            >
              <span className="truncate">{currentModelOpen?.displayName}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
            </button>

            {isChoiceModel && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-48 rounded-2xl border border-[#e5e5e7] bg-[#ffffff] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:border-[#39393a] dark:bg-[#1f1f20]">
                {MODEL_OPTIONS.map((model) => (
                  <button
                    key={model.model}
                    type="button"
                    onClick={
                      () => {
                        if (conversationId === null) return
                        setCurrentModel(conversationId, model.model)
                        updateCurrentModel(conversationId, model.model)
                        setIsChoiceModel(prev => !prev)
                      }
                    }
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${model.model === currentModel
                      ? "bg-[#f1f1f2] text-[#19191a] dark:bg-[#2a2a2b] dark:text-[#e2e2e6]"
                      : "text-[#4b4b4f] hover:bg-[#f3f3f4] dark:text-[#d1d1d5] dark:hover:bg-[#2a2a2b]"
                      }`}
                  >
                    {model.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`grid place-items-center w-10 h-10 border dark:border-[#39393a] border-[#e0e0e0] rounded-full ${(!loading && input) ? 'dark:bg-[#e2e2e6] dark:text-[#1e1e1f] bg-[#000000] text-[#e2e2e6]' : ''}`}
            onClick={submit}
          >
            {loading ? <Square onClick={stopGenerate} /> : <ArrowUp />}
          </button>
        </div>
      </div>
    </div >
  );
}
