import {emitConversationsUpdated } from '../utils/events'
import { db } from "../db/db"
// import { useNavigate } from 'react-router-dom'

let defaultConversationsInitPromise: Promise<void> | null = null

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

// 添加新会话时调用
export async function addConversation(
  name: string,
){
  // 1. 查找 messageCount === 0 的会话
  const emptyConv = await db.conversations
    .where("messageCount")
    .equals(0)
    .first();

  if (emptyConv) {
    // 找到了 → 直接跳转到这个空会话
    // 可以顺便更新一下名字和时间
    if (emptyConv.id === undefined) {
      throw new Error("Conversation id is undefined");
    }
    await db.conversations.update(emptyConv.id, {
      name,
      updatedAt: Date.now(),
    });
    return emptyConv.id;
  }

  // 2. 没找到 → 创建新会话
  const now = Date.now();
  const newId = await db.conversations.add({
    name,
    subtitle:'',
    messageCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  emitConversationsUpdated();
  return newId;
}

export async function deleteConversation(id:number){
 
  // 事务保证原子性--消息和会话要么一起删要么都不删
  await db.transaction("rw", [db.conversations, db.messages], async () => {
    await db.messages.where("conversationId").equals(id).delete();
    await db.conversations.delete(id);
  })
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
        { name: "DeepSeek", subtitle: "探索未至之境", createdAt: now + 2, updatedAt: now + 2, messageCount: 0 },
        { name: "chatGPT", subtitle: "探索未至之境", createdAt: now + 1, updatedAt: now + 1, messageCount: 0 },
        { name: "kimi", subtitle: "探索未至之境", createdAt: now, updatedAt: now, messageCount: 0 },
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