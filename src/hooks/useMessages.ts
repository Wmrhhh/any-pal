import { useEffect, useState } from "react"
import Dexie from "dexie"
import { db } from "../db/db"
import { type ChatMessage } from "../types/chat"

// 获取指定会话的消息，时间正序，最早的在最前边
export function useMessages(conversationId: number | null){
    // 自定义事件的作用 = "非 React 代码通知 React 组件"
  const CONVERSATIONS_UPDATED_EVENT = "chat-conversations-updated"
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