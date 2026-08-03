import { useState, useEffect, useRef } from "react";
import MessageBox from "../../components/MessageBox";
import { addMessage } from "../../db/useChatDB";
import { useMessages } from "../../hooks/useMessages"
import { type ChatMessage, type Conversation } from "../../types/chat";
import { db } from "../../db/db";
import { useChatStore } from "../../store/chatStore";

export default function ChatContent() {
  const conversationId = useChatStore((state) => state.conversationId)
  const messages = useMessages(conversationId)
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Runtime状态
  const [streamingReply, setStreamingReply] = useState("")
  const [conversation, setConversation] = useState<Conversation | null>(null)
  // 初始值是null，因为一开始DOM还不存在
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // const { conversationIdRouter } = useParams()
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
      // const data = await res.json();

      // 从 Response.body 这个数据流上创建一个读取器，以后我可以自己控制读取节奏。
      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error("无法获取响应流")
      }
      // TextDecoder 是把字节码解析成我们认识的文字符号。
      const decoder = new TextDecoder()
      // const reply = data.choices[0].message.content;
      let fullReply = "";

      while (true) {
        // 持续的拿取数据
        const { done, value } = await reader.read()
        if (done) {
          await addMessage(conversationId, "assistant", fullReply)
          setStreamingReply('')
          break;
        }
        const chunk = decoder.decode(value, {
          stream: true,
        })
        // console.log(chunk)
        const lines = chunk.split("\n")
        // console.log(lines);
        for (const line of lines) {
          // console.log(line);
          if (!line.startsWith("data: ")) {
            continue
          }
          if (line === "data: [DONE]") {
            continue
          }
          // console.log(line);
          const jsonString = line.replace("data: ", "")
          // console.log(jsonString);
          // 把一个完整的 JSON 字符串解析成 JavaScript 对象。
          const json = JSON.parse(jsonString)
          // console.log(json);
          const content = json.choices[0].delta.content ?? "";
          // console.log(content);
          fullReply += content;
          setStreamingReply(fullReply)
        }

      }
      // 把AI回复写入DB
      // await addMessage(conversationId, "assistant", reply)
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
      <div className="flex flex-col bg-[#fafafa] dark:bg-[#1e1e1f] h-full min-h-0 flex-14/20">
        <h2 className="relative  dark:text-[#e1e1e5] text-[#19191a] pb-3 shrink-0 m-3 mb-0">
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
                <div className={`mx-3 rounded-lg ${msg.role === "user" ? "" : "w-10 h-10 bg-[#000000]"}`}></div>
                <div className={`${msg.role === "user" ? "" : "w-2/3"}  bg-[#eeeef0] text-[#19191a] dark:bg-[#2f2f30] dark:text-[#e1e1e5] rounded-lg p-3 mb-3`}>{msg.content}</div>
                <div className={`mx-3 rounded-lg ${msg.role === "user" ? "w-10 h-10 bg-[#19ac70]" : ""}`}></div>
              </div>
            </div>
          ))}
          {loading && !streamingReply && (
            < div className="flex justify-start">
              <div className="mx-3 rounded-lg w-10 h-10 dark:bg-[#000000]"></div>
              <div className=" dark:text-[#e1e1e5]  text-[#19191a] rounded-lg p-3 mb-3 animate-pulse">正在思考中</div>
            </div>)}
          {streamingReply && (
            <div
              className={`bg-chat-bg flex justify-start`}
            >
              <div className={`mx-3 rounded-lg w-10 h-10 bg-[#000000]`}></div>
              <div className={` w-2/3  bg-[#eeeef0] text-[#19191a] dark:bg-[#2f2f30] dark:text-[#e1e1e5] rounded-lg p-3 mb-3`}>{streamingReply}</div>
            </div>
          )}
        </div>
        <MessageBox
          sendMessage={sendMessage}
          loading={loading}
          input={input}
          setInput={setInput}>
        </MessageBox>
      </div >
    </>
  )
}
