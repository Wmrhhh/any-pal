export const CONVERSATIONS_UPDATED_EVENT = "chat-conversations-updated";

// 自定义事件的作用 = "非 React 代码通知 React 组件"
export function emitConversationsUpdated() {
  window.dispatchEvent(new Event(CONVERSATIONS_UPDATED_EVENT));
}
