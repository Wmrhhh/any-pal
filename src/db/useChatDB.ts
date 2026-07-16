import { type Conversation, type ChatMessage } from "../types/chat"
import { useEffect, useState } from "react"
import { db } from "../db/db"
import Dexie from "dexie";


// 获取会话列表，按更新时间倒序(最新的在最前边)
export function useConversations(){
  const [conversations, setConversations] = useState<Conversation[]>([])

  // 读本地数据库、改react状态属于副作用
  useEffect(()=>{
    // async只修饰函数
    const load = async () => {
      // db.conversations: 操作conversations这张表
      // .orderBy("updatedAt"): 按照updatedAt索引排序
      // .reverse()；翻转顺序：数值大的在前即最近聊过的会话排第一
      // .toArray(): 把Dexie的集合对象转成js数组
      const list = await db.conversations.orderBy("updatedAt").reverse().toArray();
      // 把数据写道react状态，触发重新渲染
      setConversations(list);
    }
    load()
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
      setMessages([]);
      return;
    }
    const load = async ()=>{
      const list = await db.messages
      // 指定用复合索引查询
        .where("[conversationId+createdAt]")
      // 范围查询：只查 conversationId 匹配的记录，时间从最小到最大
        .between([conversationId, Dexie.minKey], [conversationId, Dexie.maxKey])
      // 把查询结果集合转成js数组
        .toArray();
      setMessages(list)
    }
    load()
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
}

// 初始化默认会话，仅在数据库为空时插入一次
export async function initDefaultConversations() {
  // 查询表内有多少条记录  count()是Dexie的计数api，返回一个数字
  const count = await db.conversations.count();
  if (count === 0) {
    const now = Date.now();
    // bulkAdd()批量插入，比循环调用add()效率高
    await db.conversations.bulkAdd([
      // +1 +2是让时间戳有差异，保证排序顺序固定
      { name: "DeepSeek", subtitle: "探索未至之境", createdAt: now, updatedAt: now },
      { name: "chatGPT", subtitle: "探索未至之境", createdAt: now + 1, updatedAt: now + 1 },
      { name: "kimi", subtitle: "探索未至之境", createdAt: now + 2, updatedAt: now + 2 },
    ]);
  }
}