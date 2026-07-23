import { type Conversation, type ChatMessage } from "../types/chat"
import { useEffect, useState } from "react"
import { db } from "../db/db"
import Dexie from "dexie"

let defaultConversationsInitPromise: Promise<void> | null = null
// 自定义事件的作用 = "非 React 代码通知 React 组件"
const CONVERSATIONS_UPDATED_EVENT = "chat-conversations-updated"

function emitConversationsUpdated() {
  window.dispatchEvent(new Event(CONVERSATIONS_UPDATED_EVENT))
}

// 获取会话列表，按更新时间倒序(最新的在最前边)
export function useConversations(){
  const [conversations, setConversations] = useState<Conversation[]>([])

  // 读本地数据库、改react状态属于副作用
  useEffect(()=>{
    let cancelled = false

    const load = async () => {
      // db.conversations: 操作conversations这张表
      // .orderBy("updatedAt"): 按照updatedAt索引排序
      // .reverse()；翻转顺序：数值大的在前即最近聊过的会话排第一
      // .toArray(): 把Dexie的集合对象转成js数组
      const list = await db.conversations.orderBy("updatedAt").reverse().toArray();
      if (!cancelled) {
        // 把数据写道react状态，触发重新渲染
        setConversations(list);
      }
    }

    // Promise 缓存 = "占坑"，告诉后来者"别重复干活，等我就行"
    const handleRefresh = () => {
      void load()
    }

    // addMessage 不在 React 组件里调用，它拿不到 Context
    // 如果有人发送(CONVERSATIONS_UPDATED_EVENT事件，就执行handleRefresh
    window.addEventListener(CONVERSATIONS_UPDATED_EVENT, handleRefresh)
    void load()

    return () => {
      cancelled = true
      // removeEventListener 的作用不是简单释放内存，而是解除组件和外部系统之间的连接，避免已经销毁的组件继续响应事件，同时防止内存泄漏和重复执行逻辑。
      window.removeEventListener(CONVERSATIONS_UPDATED_EVENT, handleRefresh)
    }
    // [] 空依赖数组：只在组件首次挂载时执行一次
  },[])
  // 把当前状态返回给调用方
  return conversations
}

// 获取指定会话的消息，时间正序，最早的在最前边
export function useMessages(conversationId: number | null){
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(()=>{
    if(conversationId === null){
      // Avoid calling setState synchronously inside the effect to prevent
      // cascading renders. Schedule it on the microtask queue instead.
      // 把 setState 推到微任务队列，让当前 effect 先完成，React 调度器能正确合并更新
      queueMicrotask(() => setMessages([]));
      return;
    }

    let cancelled = false 

    const load = async ()=>{
      const list = await db.messages
      // 指定用复合索引查询
        .where("[conversationId+createdAt]")
      // 数据库索引树里，数据是先按 conversationId 分组，组内再按 createdAt 排好序的
        .between([conversationId, Dexie.minKey], [conversationId, Dexie.maxKey])
      // 把查询结果集合转成js数组
        .toArray();
        if(!cancelled){
          setMessages(list)
        }
      
    }
    const handleRefresh = () => {
      void load()
    }
    window.addEventListener(CONVERSATIONS_UPDATED_EVENT, handleRefresh)
    void load()
    return()=>{
      cancelled = true
      window.removeEventListener(CONVERSATIONS_UPDATED_EVENT, handleRefresh)
    }
  }, [conversationId])

  return messages
}

// 发送消息时调用：写入消息记录 + 更新会话的updatedAt
export async function addMessage(
  conversationId: number,
  role: "user" | "assistant" | "system",
  content: string
){ 
  const now = Date.now();
  await db.messages.add({
    conversationId,
    role,
    content,
    createdAt: now,
  });
  // 更新conversations表中id为conversationId的那条记录，把他的时间改为当前时间now
  await db.conversations.update(conversationId, { updatedAt: now });
  emitConversationsUpdated();
}

// 初始化默认会话，仅在数据库为空时插入一次
export async function initDefaultConversations() {
  // 缓存正在执行的初始化任务，防止重复执行。
  // Promise 缓存
  if (defaultConversationsInitPromise) {
    return defaultConversationsInitPromise;
  }

  // "rw" 事务保证原子性：查空和插入要么都成功，要么都失败
  defaultConversationsInitPromise = db.transaction("rw", db.conversations, async () => {
    // 查询表内有多少条记录  count()是Dexie的计数api，返回一个数字
    const count = await db.conversations.count();
    if (count === 0) {
      const now = Date.now();
      // bulkAdd()批量插入，比循环调用add()效率高
      // 这里按默认顺序设置不同的时间戳，避免 updatedAt 相同导致排序顺序不稳定
      await db.conversations.bulkAdd([
        { name: "DeepSeek", subtitle: "探索未至之境", createdAt: now + 2, updatedAt: now + 2 },
        { name: "chatGPT", subtitle: "探索未至之境", createdAt: now + 1, updatedAt: now + 1 },
        { name: "kimi", subtitle: "探索未至之境", createdAt: now, updatedAt: now },
      ]);
      emitConversationsUpdated();
    }
  });

  try {
    await defaultConversationsInitPromise;
  } finally {
    defaultConversationsInitPromise = null;
  }
}