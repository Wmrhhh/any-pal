import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore, useThemeStore } from "./chatStore";

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      conversationId: null,
      currentModels: {},
    });
  });

  it("初始状态正确", () => {
    const state = useChatStore.getState();
    expect(state.conversationId).toBeNull();
    expect(state.currentModels).toEqual({});
  });

  it("setConversationId 更新当前会话 ID", () => {
    useChatStore.getState().setConversationId(42);

    expect(useChatStore.getState().conversationId).toBe(42);
  });

  it("setConversationId 接受 null（取消选中）", () => {
    useChatStore.getState().setConversationId(42);
    useChatStore.getState().setConversationId(null);

    expect(useChatStore.getState().conversationId).toBeNull();
  });

  it("setCurrentModels 为会话添加模型", () => {
    useChatStore.getState().setCurrentModels(1, "DeepSeek-v4-flash");

    expect(useChatStore.getState().currentModels[1]).toBe("DeepSeek-v4-flash");
  });

  it("setCurrentModels 保留已有会话的模型（不覆盖）", () => {
    useChatStore.getState().setCurrentModels(1, "DeepSeek-v4-flash");
    useChatStore.getState().setCurrentModels(2, "Kimi-k2.6");

    const { currentModels } = useChatStore.getState();
    expect(currentModels[1]).toBe("DeepSeek-v4-flash");
    expect(currentModels[2]).toBe("Kimi-k2.6");
    expect(Object.keys(currentModels)).toHaveLength(2);
  });

  it("setCurrentModels 对同一会话覆盖而非追加", () => {
    useChatStore.getState().setCurrentModels(1, "DeepSeek-v4-flash");
    useChatStore.getState().setCurrentModels(1, "Kimi-k2.6");

    const { currentModels } = useChatStore.getState();
    expect(currentModels[1]).toBe("Kimi-k2.6");
    expect(Object.keys(currentModels)).toHaveLength(1);
  });
});

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "dark" });
  });

  it("初始主题为 dark", () => {
    expect(useThemeStore.getState().theme).toBe("dark");
  });

  it("setTheme 切换到 light", () => {
    useThemeStore.getState().setTheme("light");

    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("setTheme 可以来回切换", () => {
    useThemeStore.getState().setTheme("light");
    useThemeStore.getState().setTheme("dark");

    expect(useThemeStore.getState().theme).toBe("dark");
  });
});
