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
  -涉及性能优化（memo）                                                   -(未完成)

# 2026-7-15 to 7-18

## 如何存储聊天内容

### 使用IndexedDB的封装库Dexie(未来在逐步添加后端数据库-以实现离线优先)

1. types/chat.ts
  - Conversation作用：描述每个chat(联系人)
  - ChatMessage作用：描述右侧聊天窗口里的每一条消息
  ### 问题 1：为什么 id?: number 要加 ?
    - 插入前数据库还没分配 id，创建对象时可以不写
  ### 问题 2：为什么时间用 number 不用 Date
    - 数字方便比较排序，JSON 传输友好，Dexie 索引性能更好


2. db/db.ts
  - 作用：创建了两张表，并且规定了表的结构、名称、索引
  ### 问题 1：++id 是什么意思？
    - 自增主键，Dexie 自动分配，插入时禁止手动指定
  ### 问题 2：复合索引 [conversationId+createdAt] 比单索引快在哪？
    - 单索引查出来是乱的，要内存再排序；复合索引查出来自带时间顺序，一步完成


3. db/useChatDb.ts
  - 作用： 封装了所有数据的读写具体操作操作，需要数据时就调用hooks、函数
  ### 问题 1：为什么不能 useEffect(async () => {}) 而是 const load = async ()=>{} ?
    - 因为useEffect要求回调函数必须返回undefined或者()=>{}，而useEffect(async () => {})返回的是promise
  ### 问题 2：为什么写hook ?
    - react要求hook只能在组件内或者hook内，为了复用带状态的逻辑
  ### 问题 3：Promise 缓存变量是干嘛的？
    - 防 React 18 StrictMode 重复挂载导致重复插入数据
  ### 问题 4：queueMicrotask(() => setMessages([])) 改成直接 setMessages([]) 会怎样？
    - 同步 setState 在 effect 里可能触发级联渲染
  ### 问题 5：cancelled 是干嘛的？
    - 防止过期请求覆盖最新数据  (竞态条件)
  ### 问题 6：为什么用自定义事件不用 Context？
    - addMessage 在组件树外，拿不到 Context，事件是最轻量的跨层通信。
  
  
4. server/chat.js
  - 作用：接收前端发来的消息，转发给 DeepSeek API，再把 AI 的回复返回给前端。

# 2026-7-18

## 学习

1. 事件循环
  - 调用栈（同步代码）→ 清空 → 微任务队列（Promise.then / queueMicrotask）→ 清空 → 宏任务队列（setTimeout）→ 渲染
2. 异步
 - async 函数总是返回 Promise，即使没写 return
3. 自动批处理
  - 无论在哪里（事件处理、setTimeout、Promise），多个 setState 合并成一次渲染。
4. 不可变更新
  - React 通过引用比较判断数据变化


# 2026-7-21

## 关于Promise

 - Promise 是 JavaScript 原生提供的对象，很多异步 API（fetch、数据库操作等）返回 Promise。Promise<T> 表示未来会得到一个 T 类型的数据。
 代码中的defaultConversationsInitPromise(默认会话初始话任务) 用来缓存正在执行的初始化任务，防止 React StrictMode 或其他地方重复调用
 初始化函数。它不是让 JS 自动合并两个 Promise，而是让后续调用直接复用第一次创建的 Promise。

## 非React数据层，如何通知React UI更新

 - 数据变化 - 发送自定义事件 - 监听事件 - 触发回调函数 - 重新读取数据 - 渲染

## 分层思想

 - 数据库层 - 修改数据
 - 事件层 - 通知变化
 - react层 - 重新读取数据并渲染


# 2026-7-23

## Zustand

 1. 使用场景
  - Zustand负责管理 React 应用中的「跨组件共享状态（global/client state）」，让多个组件能够读取和修改同一份状态，而不用通过 props 层层传递。

 2. 为什么message不用Zustand
  - message数据源是本地数据库，或后端数据库，如果zustand没同步或者两个数据源不一致会很危险？      -(什么危险？)