import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../utils/events", () => ({
  emitConversationsUpdated: vi.fn(),
  CONVERSATIONS_UPDATED_EVENT: "chat-conversations-updated",
}));

import { db } from "./db";
import {
  addMessage,
  deleteConversation,
  addConversation,
} from "./useChatDB";

async function seedConversation(
  overrides: Partial<{
    name: string;
    subtitle: string;
    messageCount: number;
    currentModel: string;
  }> = {},
) {
  const now = Date.now();
  const id = await db.conversations.add({
    name: overrides.name ?? "Test",
    subtitle: overrides.subtitle ?? "",
    messageCount: overrides.messageCount ?? 0,
    currentModel: overrides.currentModel ?? "DeepSeek-v4-flash",
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

describe("useChatDB", () => {
  beforeEach(async () => {
    await db.conversations.clear();
    await db.messages.clear();
  });

  describe("addMessage", () => {
    it("写入消息到 messages 表", async () => {
      const convId = await seedConversation();

      await addMessage(convId, "user", "Hello world", "DeepSeek-v4-flash");

      const messages = await db.messages.toArray();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe("Hello world");
      expect(messages[0].role).toBe("user");
      expect(messages[0].conversationId).toBe(convId);
      expect(messages[0].model).toBe("DeepSeek-v4-flash");
    });

    it("递增 conversation 的 messageCount", async () => {
      const convId = await seedConversation();

      await addMessage(convId, "user", "msg1", "DeepSeek-v4-flash");
      await addMessage(convId, "assistant", "reply1", "DeepSeek-v4-flash");

      const conv = await db.conversations.get(convId);
      expect(conv?.messageCount).toBe(2);
    });

    it("更新 conversation 的 updatedAt 时间戳", async () => {
      const oldTime = Date.now() - 10000;
      const convId = await db.conversations.add({
        name: "Test",
        subtitle: "",
        messageCount: 0,
        currentModel: "DeepSeek-v4-flash",
        createdAt: oldTime,
        updatedAt: oldTime,
      });

      await addMessage(convId, "user", "Hello", "DeepSeek-v4-flash");

      const conv = await db.conversations.get(convId);
      expect(conv?.updatedAt).toBeGreaterThan(oldTime);
    });
  });

  describe("deleteConversation", () => {
    it("从 conversations 表删除会话", async () => {
      const convId = await seedConversation();

      await deleteConversation(convId);

      const conv = await db.conversations.get(convId);
      expect(conv).toBeUndefined();
    });

    it("事务原子性：同时删除该会话下所有消息", async () => {
      const convId = await seedConversation();

      await addMessage(convId, "user", "msg1", "DeepSeek-v4-flash");
      await addMessage(convId, "assistant", "reply1", "DeepSeek-v4-flash");
      await addMessage(convId, "user", "msg2", "DeepSeek-v4-flash");

      await deleteConversation(convId);

      const orphanedMessages = await db.messages
        .where("conversationId")
        .equals(convId)
        .toArray();
      expect(orphanedMessages).toHaveLength(0);
    });

    it("只删除目标会话的消息，不影响其他会话", async () => {
      const convA = await seedConversation({ name: "A" });
      const convB = await seedConversation({ name: "B" });

      await addMessage(convA, "user", "msg in A", "DeepSeek-v4-flash");
      await addMessage(convB, "user", "msg in B", "DeepSeek-v4-flash");

      await deleteConversation(convA);

      const remainingMessages = await db.messages.toArray();
      expect(remainingMessages).toHaveLength(1);
      expect(remainingMessages[0].conversationId).toBe(convB);
    });
  });

  describe("addConversation", () => {
    it("没有空会话时创建新会话", async () => {
      await seedConversation({ name: "Existing", messageCount: 5 });

      const newId = await addConversation("DeepSeek");

      const allConvs = await db.conversations.toArray();
      expect(allConvs).toHaveLength(2);

      const newConv = await db.conversations.get(newId);
      expect(newConv?.name).toBe("DeepSeek");
      expect(newConv?.messageCount).toBe(0);
      expect(newConv?.subtitle).toBe("");
    });

    it("存在空会话时复用而非新建", async () => {
      const emptyId = await seedConversation({
        name: "Old Name",
        subtitle: "old subtitle",
        messageCount: 0,
      });

      const returnedId = await addConversation("DeepSeek");

      expect(returnedId).toBe(emptyId);

      const allConvs = await db.conversations.toArray();
      expect(allConvs).toHaveLength(1);

      const conv = await db.conversations.get(emptyId);
      expect(conv?.name).toBe("DeepSeek");
      expect(conv?.subtitle).toBe("");
    });

    it("新会话的默认 model 为 DeepSeek-v4-flash", async () => {
      const newId = await addConversation("DeepSeek");

      const conv = await db.conversations.get(newId);
      expect(conv?.currentModel).toBe("DeepSeek-v4-flash");
    });
  });
});
