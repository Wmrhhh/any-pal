
import { db } from "../db/db"

let defaultConversationsInitPromise: Promise<void> | null = null
// 自定义事件的作用 = "非 React 代码通知 React 组件"
const CONVERSATIONS_UPDATED_EVENT = "chat-conversations-updated"

function emitConversationsUpdated() {
  window.dispatchEvent(new Event(CONVERSATIONS_UPDATED_EVENT))
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