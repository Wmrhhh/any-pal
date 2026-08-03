import { useEffect, useState } from "react"
import { db } from "../db/db"
import { type Conversation } from "../types/chat"
import { CONVERSATIONS_UPDATED_EVENT } from '../utils/events'

// 获取会话列表，按更新时间倒序(最新的在最前边)
export function useConversations(){
  const [conversations, setConversations] = useState<Conversation[]>([])
  // let defaultConversationsInitPromise: Promise<void> | null = null
  // 自定义事件的作用 = "非 React 代码通知 React 组件"

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