import { useState, useEffect, useRef } from "react";
import MessageBox from './MessageBox'
import { addMessage, useMessages } from "../../db/useChatDB"
import { type ChatMessage, type Conversation } from "../../types/chat"
import { db } from "../../db/db"
import { useChatStore } from "../../store/chatStore";

export default function ChatContent() {
  const conversationId = useChatStore((state) => state.conversationId)
  const messages = useMessages(conversationId)
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null)
  // 初始值是null，因为一开始DOM还不存在
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId !== null) {
      db.conversations.get(conversationId).then((conversation) => {
        setConversation(conversation || null)
      })
    }
  }, [conversationId])

  // 调用后端接口的核心函数
  async function sendMessage() {

    // input.trim()	去掉输入首尾空格
    if (!input.trim() || loading || conversationId === null) return;

    const userContent = input;
    setInput("")
    setLoading(true);

    // 先把用户消息写入DB(写入完成后再发给API)
    await addMessage(conversationId, "user", userContent)

    const updatedMessages = [...messages, { role: "user" as const, content: userContent }]

    try {
      // res是一个Response对象 status ok headers json() text()
      // await等待请求发出去，响应头返回来
      const res = await fetch("/api/chat", {
        method: "POST", // 提交数据
        headers: {
          "Content-Type": "application/json", // 告诉后端发送JSON格式数据
        },
        body: JSON.stringify({ messages: updatedMessages }), // 把JS对象解析成JSON字符串
      });

      if (!res.ok) {
        throw new Error(`请求失败: ${res.status}`);
      }

      // await等待响应体数据到达，解析成js对象
      const data = await res.json();
      const reply = data.choices[0].message.content;

      // 把AI回复写入DB
      await addMessage(conversationId, "assistant", reply)
    } catch (err) {
      console.error("调用失败：", err);
      alert("消息发送失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',  // 平滑滚动
    });
  }, [messages]);
  return (
    <>
      <div className="flex flex-col bg-chat-bg h-full min-h-0 flex-14/20">
        <h2 className="relative text-chat-text pb-3 shrink-0 m-3 mb-0">
          {/* 动态显示当前会话名称 */}
          {/* conversation有值时显示conversation.name,只有在null/undefined时显示“聊天” */}
          {conversation?.name ?? "聊天"}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#39393a]" />
        </h2>
        <div className="flex-1 overflow-y-auto mr-0" ref={messagesContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col ">
              <div className="text-[#7b7b80] flex justify-center">
                {(() => {
                  const ts = (msg as ChatMessage).createdAt;
                  if (!ts) return "";
                  const d = new Date(ts);
                  const h = String(d.getHours()).padStart(2, '0');
                  const m = String(d.getMinutes()).padStart(2, '0');
                  return `${h}:${m}`;
                })()}
              </div>
              <div
                className={`bg-chat-bg flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`mx-3 rounded-lg ${msg.role === "user" ? "" : "w-10 h-10 bg-chat-bg-secondary"}`}></div>
                <div className={`${msg.role === "user" ? "" : "w-2/3"} text-chat-text bg-chat-bg-secondary rounded-lg p-3 mb-3`}>{msg.content}</div>
                <div className={`mx-3 rounded-lg ${msg.role === "user" ? "w-10 h-10 bg-chat-accent" : ""}`}></div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="mx-3 rounded-lg w-10 h-10 bg-chat-bg-secondary "></div>
              <div className=" text-chat-text bg-chat-bg-secondary rounded-lg p-3 mb-3 animate-pulse">正在思考中</div>
            </div>)}
        </div>
        <MessageBox
          sendMessage={sendMessage}
          loading={loading}
          input={input}
          setInput={setInput}>
        </MessageBox>
      </div>
    </>
  )
}
