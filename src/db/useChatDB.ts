import { emitConversationsUpdated } from "../utils/events";
import { db } from "../db/db";

let defaultConversationsInitPromise: Promise<void> | null = null;

// 发送消息时调用：写入消息记录 + 更新会话的updatedAt
export async function addMessage(
  conversationId: number,
  role: "user" | "assistant" | "system",
  content: string,
  model: string,
) {
  // const count = 0
  const now = Date.now();
  await db.messages.add({
    conversationId,
    role,
    content,
    model: model,
    createdAt: now,
  });
  const conversation = await db.conversations.get(conversationId);
  const nextCount = (conversation?.messageCount ?? 0) + 1;
  await db.conversations.update(conversationId, {
    updatedAt: now,
    messageCount: nextCount,
  });
  emitConversationsUpdated();
}

// 更新subTitle
export async function generateSubtitle(conversationId: number) {
  // console.log("开始生成 subtitle", conversationId)
  const conversation = await db.conversations.get(conversationId);
  // console.log("conversation:", conversation)
  if (!conversation) return;

  if (conversation.subtitle) return;

  const firstUserMessage = await db.messages
    .where("conversationId")
    .equals(conversationId)
    .filter((message) => message.role === "user")
    .first();

  if (!firstUserMessage) return;
  // console.log(firstUserMessage);

  const userContent = firstUserMessage.content.trim();
  if (!userContent) return;

  try {
    // console.log("准备请求 summarySubtitle")
    const res = await fetch("/api/summarySubtitle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userContent }),
    });

    if (!res.ok) {
      throw new Error(`请求失败：${res.status}`);
    }
    // console.log("fetch 已经返回", res)
    const data = await res.json();
    // console.log("json 已经解析", data)
    const subtitle = data?.choices?.[0]?.message?.content?.trim();
    if (!subtitle) return;
    // console.log(subtitle);

    await db.conversations.update(conversationId, { subtitle });
    emitConversationsUpdated();
  } catch (err) {
    console.log(err);
  }
}

export async function updateCurrentModel(
  conversationId: number,
  currentModel: string,
) {
  await db.conversations.update(conversationId, { currentModel: currentModel });
  emitConversationsUpdated();
}

// 添加新会话时调用
export async function addConversation(name: string) {
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
      subtitle: "",
    });
    return emptyConv.id;
  }

  // 2. 没找到 → 创建新会话
  const now = Date.now();
  const newId = await db.conversations.add({
    name,
    subtitle: "",
    messageCount: 0,
    currentModel: "DeepSeek-v4-flash",
    createdAt: now,
    updatedAt: now,
  });
  emitConversationsUpdated();
  return newId;
}

export async function deleteConversation(id: number) {
  // 事务保证原子性--消息和会话要么一起删要么都不删
  await db.transaction("rw", [db.conversations, db.messages], async () => {
    await db.messages.where("conversationId").equals(id).delete();
    await db.conversations.delete(id);
  });
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
  defaultConversationsInitPromise = db.transaction(
    "rw",
    db.conversations,
    async () => {
      // 查询表内有多少条记录  count()是Dexie的计数api，返回一个数字
      const count = await db.conversations.count();
      if (count === 0) {
        const now = Date.now();
        // bulkAdd()批量插入，比循环调用add()效率高
        // 这里按默认顺序设置不同的时间戳，避免 updatedAt 相同导致排序顺序不稳定
        await db.conversations.bulkAdd([
          {
            name: "DeepSeek",
            subtitle: "探索未至之境",
            createdAt: now + 2,
            currentModel: "DeepSeek-v4-flash",
            updatedAt: now + 2,
            messageCount: 0,
          },
          {
            name: "chatGPT",
            subtitle: "探索未至之境",
            createdAt: now + 1,
            currentModel: "DeepSeek-v4-flash",
            updatedAt: now + 1,
            messageCount: 0,
          },
          {
            name: "kimi",
            subtitle: "探索未至之境",
            createdAt: now,
            currentModel: "DeepSeek-v4-flash",
            updatedAt: now,
            messageCount: 0,
          },
        ]);
        emitConversationsUpdated();
      }
    },
  );

  try {
    await defaultConversationsInitPromise;
  } finally {
    defaultConversationsInitPromise = null;
  }
}
