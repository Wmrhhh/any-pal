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


# 2026-7-24

## 问题：点击setting后浏览器地址栏干煸，router内部发生了什么？
  - 点击按钮 -> React Router 调用浏览器 History API -> 浏览器地址栏变成 /settings ->
    React Router 监听到 URL 改变 -> Router 开始匹配路由 -> 找到：path="/settings" element=<SettingPage />  -> React 重新渲染 -> 页面显示 SettingPage
      
  - URL先变 ，Router再根据URL决定渲染什么

  - (注意：是router阻止浏览器默认行为)


# 2026-7-26

## 问题1：Provider为什么通常放App？
  - Provider本质是给下面所有组件提供什么能力 
  - 谁应该包住最多东西 ---应用最外层

## 问题2：BrowserRouter是什么？/ RouterProvider 是什么？
  - 主要提供基础路由能力
  - 监听浏览器URL
  - 提供路由上下文

  - 处路由匹配外，还提供loader、action、错误处理等数据流能力，适合大型应用

## 问题3：App.tsx的职责？
  - 组装App应用
  - App.tsx通常作为应用根组件，用来组合全局Provider、错误边界、初始话逻辑等，使main.tsx保持简单。

  - main.tsx负责启动React应用

## 问题4：Provider 的嵌套关系

  - Provider的嵌套顺序主要取决于依赖关系。如果一个Provider提供的能力会被另一个Provider使用，需要放在外层
  - 外层提供基础能力 如主题状态
  - 内层使用基础能力 


### 每一个组件都要告诉React我要渲染什么


# 2026-7-30

## 流式输出

- token: AI 能理解的最小文本单位。
- ReadableStream: 负责：不断读取。
- TextDecoder: 负责：把0101010101变成React,因为网络传输是二进制。

### fetch 如何实现流式读取？

- fetch 返回 Response 对象，其中 body 是一个 ReadableStream。通过 getReader 获取 reader，然后不断调用 read 方法读取数据块。
  由于读取的数据是二进制格式，需要使用 TextDecoder 解码成字符串，再通过 React 状态增量更新 UI。

### HTTP请求特点

- 一个HTTP请求只有一个Response.但是这个Response有两种发送方式：普通响应，流式响应

- reader.read()只认字节 
- TCP是字节流，只保证顺序，不保证每次读到多少
- SSE协议在TCP的字节流上增加了一层“消息边界” 规定 date:...<空行> 表示一条完整消息结束


# 2026-8-3

## useRef的作用

- 在组件重新渲染之间，保存一个不会触发重新渲染的值
- 最常见的用途  -- 操作DOM
- 只要数据不会显示到页面就优先考虑ref
- ref保存的是React不会跟踪变化的数据  - react不监听ref的变化

## 停止生成宏观流程

1. 创建一个AbortController
2. fetch监听它的singal
3. 用户点击停止
4. controller.abort()发出停止信号 

- 浏览器收到
 1. 停止信号
 2. 停止fetch
 3. reader.read()结束
 4. catch AbortError

## AbortController 
- 适用于那些"持续执行"或者"耗时执行"的任务。
- 本身不会停止浏览器，它只是发出一个取消信号(Signal)。支持 AbortSignal 的 Web API 在收到这个信号后，会自行终止当前正在执行的异步任务。


## Parser(解析器)

- paresSSE
- Markdown Parser

### 解析器的工作

- 输入 => 分析(按照语法规则) => 输出


# 2026-8-4

## Markdown + CodeBlock + 复制

1. 为什么需要Markdown？
- 返回html会有安全问题 
- 前端不好控制样式

2. code组件为什么特殊?
- 有两种代码 行内代码 和 代码块 语言信息在className内

3. 为什么拆CodeBlock?
- 职责拆分  负责 -代码展示 -复制 -高亮 -代码相关功能 
- 状态属于CodeBlock状态改变不会刷新整个聊天
- 限制状态更新影响范围


# 2026-8-7

## React渲染流程
   - React渲染修改DOM节点的属性/结构，浏览器渲染才是把“DOM变成屏幕上的像素”
1. Render阶段（执行组件函数）
  - 计算新的虚拟DOM
  - 这个阶段可以执行多次（并发模式下可中断）
2. Commit阶段（提交到真实DOM）
  - 把虚拟DOM的差异同步到真实DOM
  - 同步执行，不可中断
  - 完成后才执行useEffect

## useEffect的执行规则
- React在每次渲染后，会按定义顺序检查所有useEffect的依赖数组
- 依赖变了 => 把这个effect加入到“待执行队列”
- 所有effect检查完后，按队列顺序一次执行

## 事件循环与浏览器渲染
- 显示器（60hz）刷新率决定是大概每16.6ms进行一次渲染，一次事件循环包括 宏任务 → 微任务 → （可能）渲染，如果这个宏任务执行时间特别长，那这一帧就不会渲染，就是丢帧，浏览器只有在 “调用栈空了”的时候才有机会渲染

- 引出react18 做并发模式--把长同步计算切成小块，中间让浏览器能渲染

## useEffect 和 useLayoutEffect的区别
- useEffect在浏览器完成绘制之后执行
- useLayoutEffect在浏览器绘制之前同步执行

-- useEffect 是浏览器完成渲染后异步执行，不会阻塞浏览器绘制，适合处理大部分副作用，比如请求、事件监听、订阅等。useLayoutEffect 会在 DOM 更新后、浏览器绘制之前同步执行，会阻塞绘制，通常用于需要读取 DOM 布局信息或者需要避免视觉闪烁的场景，比如测量元素尺寸、同步调整位置。实际开发中优先使用 useEffect，只有涉及布局同步时才使用 useLayoutEffect。

## requestAnimationFrame(简称 rAF)
- 是浏览器提供的一个API,作用是：告诉浏览器“在下次重绘之前调用这个函数”

- 和setTimeout的区别
1. setTimeout是可能会掉帧，是宏任务，可能排在渲染之后，用户看到的画面已经滞后了
2. rAF和帧同步，回调在浏览器准备渲染下一帧之前执行，修改的状态会立即被渲染，不浪费帧

- 关键特性：自动节流，页面在后台（切换到其他标签页）时，rAF会暂停执行，而setTimeout还会继续执行，对性能优化很重要。


# 2026-8-9

## React：DOM 滚动与副作用

### 1. 为什么滚动经常使用 useRef + useEffect？

React 中直接操作 DOM 属于副作用。

- `useRef`：保存 DOM 元素的引用，不会因为 `.current` 改变而触发重新渲染。
- `useEffect`：等待 React 完成渲染、DOM 更新后，再执行滚动等 DOM 操作。


# 2026-8-10

## 通过第一条用户消息更新subtitle

- 用户发送第一条消息 -> sendMessage() -> addMessage(user) -> 请求 /api/chat

  -> AI 流式回复完成 -> addMessage(assistant) ->  generateSubtitle(conversationId)

  ->  IndexedDB 找 Conversation -> 检查 subtitle 是否为空 -> IndexedDB 找第一条

  user message -> userContent -> fetch("/api/summarySubtitle") -> Vite Proxy

  -> Express app.post(...) -> summarySubtitle() -> DeepSeek API -> AI 生成标题

  -> res.json(data) -> 前端拿到 data -> data.choices[0].message.content ->

  db.conversations.update() ->  emitConversationsUpdated() -> useConversations()

  -> React 重新渲染 -> 显示 subtitle


### 任何依赖外部系统的操作，都存在失败的可能。



##-----##



# 模型辅助学习方案

# AI 学习角色分工提示词模板

核心原则：**一个角色一个独立对话，不要在同一段对话里切换身份**。AI 没有真正的角色边界感，混在一起用会导致回答啰嗦、重点模糊。四个阶段分别开新对话。

## 阶段一｜方案设计（做之前）

**目的**：只要方案对比，不要代码，不要展开原理。

我要实现[具体功能]。给我2-3种可行方案，每种方案只说：
核心思路一句话、优点、缺点、适用场景。
不要给代码，不要展开讲原理，我选完方案后会另开对话让你讲原理。

## 阶段二｜原理答疑（吃透为什么）

**目的**：只讲原理，不评价代码，不出方案。讲完反问你，检验是否真懂。

只回答我问的这一个具体问题：[具体问题]。
不要延伸讲其他相关知识点，不要给我完整代码示例，除非我要求。
回答后，反问我一个问题，检验我是不是真的理解了，而不是直接告诉我下一步。

## 阶段三｜代码审查（写完之后）

**目的**：只挑毛病，不解释原理，不客套。

扮演一个严格到近乎刻薄的代码审查者。只指出问题，按严重程度排序
（会崩溃的 / 隐患 / 风格问题），每条一句话，不展开解释为什么这是问题——
如果我想知道为什么，我会单独开对话问。
不要说"整体写得不错"这类客套话，直接列问题，没问题就说没问题，不要硬找。

*如果对某条审查意见不理解 → 回到阶段二单独开对话问原理，不要在审查对话里问。*

## 阶段四｜模拟面试官（定期，比如每周一次）

**目的**：只提问、追问、施压，绝不主动给答案或提示。

扮演一个大厂前端面试官，正在面试我。就[某个技术点/最近做的项目]连续追问，
像真实面试一样层层深入，直到我答不上来为止。
不要在我答错的时候直接纠正或提示，先让我自己意识到答不上来，
面试环节结束后再统一给反馈和正确答案。

## 验证AI说法的补充习惯（不依赖AI自己）

- 用浏览器 Performance / Memory 工具，长时间高频操作后拍内存快照，看内存曲线是否只涨不降
- 故意制造异常场景（断网、接口报错、快速连续点击）测试代码是否稳定
- 定期回头看AI帮你写过的代码，看自己现在能不能独立读懂、挑出问题
- 关键结论去查官方文档验证，或换一次对话重新问同样问题看答案是否一致


##-----##


# 2026-8-14

## React/前端设计思想
- 不要因为两个东西都属于“用户输入”，就把他们放进同一个状态;应该根据数据的职责和结构来划分状态。
