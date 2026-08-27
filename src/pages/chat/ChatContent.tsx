import { useState, useEffect, useRef, useLayoutEffect } from "react";
import MessageBox from "../../components/MessageBox";
import { addMessage } from "../../db/useChatDB";
import { useMessages } from "../../hooks/useMessages";
import { type ChatMessage, type Conversation } from "../../types/chat";
import { db } from "../../db/db";
import { useChatStore } from "../../store/chatStore";
import Markdown from "../../components/Markdown/Markdown";
import parseSSE from "../../utils/parseSSE";
import { generateSubtitle } from "../../db/useChatDB";

export default function ChatContent() {
  const conversationId = useChatStore((state) => state.conversationId);
  const currentModels = useChatStore((state) => state.currentModels);
  const setCurrentModels = useChatStore((state) => state.setCurrentModels);
  const model =
    conversationId === null
      ? "DeepSeek-v4-flash"
      : (currentModels[conversationId] ?? "DeepSeek-v4-flash");
  const messages = useMessages(conversationId);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Runtime状态
  const [streamingReply, setStreamingReply] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  // 初始值是null，因为一开始DOM还不存在
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // 新增ref记录上一次会话
  const prevConversationId = useRef<number | null>(null);
  const isAtBottomRef = useRef(true);
  const shouldScrollToBottomRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  // const { conversationIdRouter } = useParams()
  const controllerRef = useRef<AbortController | null>(null);
  // let fullReply = "";
  useEffect(() => {
    if (conversationId !== null) {
      db.conversations.get(conversationId).then((conversation) => {
        setConversation(conversation || null);

        if (conversation?.currentModel) {
          setCurrentModels(conversationId, conversation.currentModel);
        } else {
          setCurrentModels(conversationId, "DeepSeek-v4-flash");
        }
      });
    }
  }, [conversationId, setCurrentModels]);

  // 调用后端接口的核心函数
  async function sendMessage() {
    // input.trim()	去掉输入首尾空格
    if (!input.trim() || loading || conversationId === null) return;

    const userContent = input;
    setInput("");
    setLoading(true);

    // 每一次请求创建一个新的AbortController
    controllerRef.current = new AbortController();

    // 先把用户消息写入DB(写入完成后再发给API)
    await addMessage(conversationId, "user", userContent, model);

    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userContent },
    ];

    let fullReply = "";
    let buffer = "";

    try {
      const formData = new FormData();
      // formData.append('message',...)这个字段适合放字符串或文件，所以转成一个JSON格式的字符串
      formData.append("messages", JSON.stringify(updatedMessages));
      formData.append("model", model);

      // res是一个Response对象 status ok headers json() text()
      // await等待请求发出去，响应头返回来
      const res = await fetch("/api/chat", {
        method: "POST", // 提交数据
        // Formdata提交不写header,交给浏览器后，浏览器会自动设置
        // 类似Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
        // 其中boundary: 浏览器需要告诉服务器：“FormData里每一段数据从哪里开始、哪里结束”
        body: formData,
        // 告诉fetch: 监听这个signal
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`请求失败: ${res.status}`);
      }

      // await等待响应体数据到达，解析成js对象
      // const data = await res.json();

      // 从 Response.body 这个数据流上创建一个读取器，以后我可以自己控制读取节奏。
      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流");
      }
      // TextDecoder 是把字节码解析成我们认识的文字符号。
      const decoder = new TextDecoder();
      // const reply = data.choices[0].message.content;
      // console.log(currentModel);

      while (true) {
        // 持续的拿取数据
        const { done, value } = await reader.read();
        if (done) {
          await addMessage(conversationId, "assistant", fullReply, model);
          setStreamingReply("");
          break;
        }
        const chunk = decoder.decode(value, {
          stream: true,
        });
        const result = parseSSE(chunk, buffer);
        buffer = result.buffer;
        for (const content of result.messages) {
          fullReply += content;
          setStreamingReply(fullReply);
        }
      }
      // 把AI回复写入DB
      // await addMessage(conversationId, "assistant", reply)
    } catch (err) {

      // 先处理已经生成的数据
      if (fullReply) {
        await addMessage(conversationId, "assistant", fullReply, model);
      }
      setStreamingReply("");
      // 判断错误 是不是用户主动停止 属不属于 DOMException
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("用户停止生成");
        return;
      }
      console.error("调用失败：", err);
      alert("消息发送失败，请重试");
    } finally {
      setLoading(false);
    }
    await generateSubtitle(conversationId);
  }

  function stopGenerate() {
    controllerRef.current?.abort();
  }

  // 用户滚动时更新“是否在底部”
  function handleScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
    isAtBottomRef.current = distanceFromBottom < 80;
  }

  // 场景一：切换会话 -> 设强制滚动标记
  useEffect(() => {
    if (conversationId !== prevConversationId.current) {
      // 记录已处理过的会话id，下次比较用
      prevConversationId.current = conversationId;
      // 重置为默认状态（在底部）
      isAtBottomRef.current = true;
      // 标记需要强制滚动
      shouldScrollToBottomRef.current = true;
    }
  }, [conversationId]);

  // 场景2：消息变化 -> 条件滚动（用useLayoutEffect 避免闪烁）
  useLayoutEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    // 如果已经有rAF在排队，取消它
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    // 登记一个新的rAF回调 - 可以取消
    rafIdRef.current = requestAnimationFrame(() => {
      if (shouldScrollToBottomRef.current) {
        shouldScrollToBottomRef.current = false;
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      } else if (isAtBottomRef.current) {
        el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
      }
      // 执行完毕清零
      rafIdRef.current = null;
    });
  }, [messages, streamingReply]);

  return (
    <>
      <div className="flex flex-col bg-[#fafafa] dark:bg-[#1e1e1f] h-full min-h-0">
        <h2 className="relative dark:text-[#e1e1e5] text-[#19191a] pb-3 shrink-0 m-3 mb-0">
          {/* 动态显示当前会话名称 */}
          {/* conversation有值时显示conversation.name,只有在null/undefined时显示“聊天” */}
          {conversation?.name ?? "聊天"}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#39393a]" />
        </h2>
        <div
          className="flex-1 overflow-y-auto mr-0"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div className="text-[#7b7b80] flex justify-center">
                {(() => {
                  const ts = (msg as ChatMessage).createdAt;
                  if (!ts) return "";
                  const d = new Date(ts);
                  const h = String(d.getHours()).padStart(2, "0");
                  const m = String(d.getMinutes()).padStart(2, "0");
                  return `${h}:${m}`;
                })()}
              </div>
              <div
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`mx-3 rounded-lg ${msg.role === "user" ? "" : "w-10 h-10 bg-[#000000]"}`}
                ></div>
                <div
                  className={`${msg.role === "user" ? "" : "w-2/3"} bg-[#eeeef0] text-[#19191a] dark:bg-[#2f2f30] dark:text-[#e1e1e5] rounded-lg p-3 mb-3`}
                >
                  <Markdown>{msg.content}</Markdown>
                </div>
                <div
                  className={`mx-3 rounded-lg ${msg.role === "user" ? "w-10 h-10 bg-[#19ac70]" : ""}`}
                ></div>
              </div>
            </div>
          ))}
          {loading && !streamingReply && (
            <div className="flex justify-start">
              <div className="mx-3 rounded-lg w-10 h-10 dark:bg-[#000000]"></div>
              <div className="dark:text-[#e1e1e5] text-[#19191a] rounded-lg p-3 mb-3 animate-pulse">
                正在思考中
              </div>
            </div>
          )}
          {streamingReply && (
            <div className={`flex justify-start`}>
              <div className={`mx-3 rounded-lg w-10 h-10 bg-[#000000]`}></div>
              <div
                className={`w-2/3 bg-[#eeeef0] text-[#19191a] dark:bg-[#2f2f30] dark:text-[#e1e1e5] rounded-lg p-3 mb-3`}
              >
                <Markdown>{streamingReply}</Markdown>
              </div>
            </div>
          )}
        </div>
        <MessageBox
          sendMessage={sendMessage}
          stopGenerate={stopGenerate}
          loading={loading}
          input={input}
          setInput={setInput}
        ></MessageBox>
      </div>
    </>
  );
}
