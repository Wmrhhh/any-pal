import { useState, useEffect } from "react";
import MessageBox from './MessageBox'
import { addMessage, useMessages } from "../db/useChatDB"
import { type Conversation } from "../types/chat"
import { db } from "../db/db"

interface ChatContentProps {
  conversationId: number | null
}
export default function ChatContent({ conversationId }: ChatContentProps) {
  const messages = useMessages(conversationId)
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null)

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

  return (
    <>
      <div className="flex flex-col bg-[#1e1e1f] col-span-2 p-3">
        <h2 className="relative text-[#e2e2e6] pb-3">
          {/* 动态显示当前会话名称 */}
          {/* conversation有值时显示conversation.name,只有在null/undefined时显示“聊天” */}
          {conversation?.name ?? "聊天"}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#39393a]" />
        </h2>
        <div className="flex-1 overflow-y-auto py-3">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col ">
              <div
                className={`bg-[#1e1e1f] flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`text-[#e2e2e6] bg-[#2f2f30] rounded-lg p-3 mb-3`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
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
