# 2026-7-12

## 调用api的方法

1. 原生fetch
  -优点：支持promise  支持流式响应
  -缺点：使用较复杂
2. axios
3. OpenAI SDK(官方库)
  -支持流式响应
  -功能齐全
  -兼容性较差


# 2026-7-14

## 如何实现单选效果

1. 状态提升至父组件-状态中存储的是那个组件当前被点击
  -涉及性能优化（memo）     (未完成)

# 2026-7-15 to 

## 如何存储聊天内容

### 使用IndexedDB的封装库Dexie(未来在逐步添加后端数据库-以实现离线优先)

1. types/chat.ts
  - Conversation作用：描述每个chat(联系人)
  - ChatMessage作用：描述右侧聊天窗口里的每一条消息

2. db/db.ts
  - 作用：创建了两张表，并且规定了表的结构、名称、索引
3. db/useChatDb.ts
  - 作用： 封装了所有数据的读写具体操作操作，需要数据时就调用hooks、函数
  ### 问题：为什么不能 useEffect(async () => {}) 而是 const load = async ()=>{} ?
    - 因为useEffect要求回调函数必须返回undefined或者()=>{}，而useEffect(async () => {})返回的是promise
  ### 问题：为什么写hook ?
    - react要求hook只能在组件内或者hook内，为了复用带状态的逻辑
