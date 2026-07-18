// Dexie是IndexedDB的封装库。IndexedDB是浏览器内置数据库
// Table是Dexie库中导出的一个类型，用于声明Dexie表的结构
import Dexie, { type Table } from "dexie";
import type { Conversation, ChatMessage } from "../types/chat"


// 定义一个类继承自Dexie
export class ChatDatabase extends Dexie {
  // conversations	属性名，对应数据库里的表名
  // !: 非空断言
  // 有一张叫 conversations 的表，存的数据是 Conversation 结构，主键(id)是 number 类型
  conversations!: Table<Conversation, number>;
  messages!: Table<ChatMessage, number>

  constructor(){
    // 调用父类的构造函数 chatAppDB数据库名称
    super("chatAppDB")

    // version(1): 数据库版本号  stores: 定义有哪些表，以及每张表的结构规则
    // 修改表结构时必须升级版本号
    this.version(1).stores({
      conversations: "++id, updatedAt",
      // 复合索引，让"筛选+排序"在索引树里一步完成
      messages: "++id, conversationId, [conversationId+createdAt]"
    })
  }
}

export const db = new ChatDatabase();