// 会话 聊天入口 chat
export interface Conversation {
  id?: number;  // chat的唯一编号
  name: string;  // 显示名称，如 DeepSeek
  subtitle?: string;  // 副标题
  createdAt: number;  // 创建时间戳(什么时候创建的)
  updatedAt: number;  // 最后更新时间戳(用于排序)
}

// 消息 具体的聊天内容 chatContent
export interface ChatMessage {
  id?: number;  // 每一条消息的编号
  conversationId: number;  // 关联的会话(chat)的id
  role: "user" | "assistant" | "system";  // 谁发的a
  content: string;  // 消息内容
  createdAt: number;   // 每一条消息的发送时间
}