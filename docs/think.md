# 2026-7-12

## 调用api的方法

1. 原生fetch
   -优点：支持promise 支持流式响应
   -缺点：使用较复杂
2. axios
3. OpenAI SDK(官方库)
   -支持流式响应
   -功能齐全
   -兼容性较差

# 2026-7-14

## 如何实现单选效果

1. 状态提升至父组件-状态中存储的是那个组件当前被点击
   -涉及性能优化（memo） -(未完成)

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

1.  使用场景

- Zustand负责管理 React 应用中的「跨组件共享状态（global/client state）」，让多个组件能够读取和修改同一份状态，而不用通过 props 层层传递。

2.  为什么message不用Zustand

- message数据源是本地数据库，或后端数据库，如果zustand没同步或者两个数据源不一致会很危险？ -(什么危险？)

# 2026-7-24

## 问题：点击setting后浏览器地址栏干煸，router内部发生了什么？

- 点击按钮 -> React Router 调用浏览器 History API -> 浏览器地址栏变成 /settings ->
  React Router 监听到 URL 改变 -> Router 开始匹配路由 -> 找到：path="/settings" element=<SettingPage /> -> React 重新渲染 -> 页面显示 SettingPage

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
- 最常见的用途 -- 操作DOM
- 只要数据不会显示到页面就优先考虑ref
- ref保存的是React不会跟踪变化的数据 - react不监听ref的变化

## 停止生成宏观流程

1. 创建一个AbortController
2. fetch监听它的singal
3. 用户点击停止
4. controller.abort()发出停止信号

- 浏览器收到

1.  停止信号
2.  停止fetch
3.  reader.read()结束
4.  catch AbortError

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

- 职责拆分 负责 -代码展示 -复制 -高亮 -代码相关功能
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

  -> AI 流式回复完成 -> addMessage(assistant) -> generateSubtitle(conversationId)

  -> IndexedDB 找 Conversation -> 检查 subtitle 是否为空 -> IndexedDB 找第一条

  user message -> userContent -> fetch("/api/summarySubtitle") -> Vite Proxy

  -> Express app.post(...) -> summarySubtitle() -> DeepSeek API -> AI 生成标题

  -> res.json(data) -> 前端拿到 data -> data.choices[0].message.content ->

  db.conversations.update() -> emitConversationsUpdated() -> useConversations()

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

_如果对某条审查意见不理解 → 回到阶段二单独开对话问原理，不要在审查对话里问。_

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


# 2026-8-28

## 打包后包体积过大的影响

1. ECP: First Contentful Paint (用户第一次看到页面上有内容的时间)
2. LCP: Largest Contentful Paint (页面中最大的主要内容什么时候完成显示)
3. TBT: Total Blocking Time (衡量页面加载过程中，主线程被JS等任务阻塞了多少时间)
4. Speed Index (页面整体变得“像一个完整页面”的速度)

- 构建后的 JS 包过大，本质上是在增加用户从“打开页面”到“真正可以使用页面”之间需要下载、解析、编译和执行的工作量。
    1. 网络传输成本增加
    2. 浏览器解析和编译成本增加
    3. 执行成本增加
    4. 首屏加载和可交互时间可能受到影响

## 其他优化指标

CLS: 页面内容有没有突然跳动



# 发现构建问题 → 分析原因 → 学习可能方案 → 测量真实影响 → 评估收益与成本 → 决定暂不优化。

- 在项目完成基础功能后，对生产环境进行构建(npm run build) 构建完成后，Vite给出警告发现主JS文件 原始体积：约1.48MB gzip后：约493KB。远超其他文件，包含了大量代码。

- 因此产生问题：项目的首屏资源是否过大？这些代码具体由哪些依赖造成？是否需要优化？

- 问题分析：最开始看到 Vite 的：Some chunks are larger than 500 kB警告时自然会分析测试是否影响性能。包体积过大也不能直接得出首屏性能也很差这个结论。因为JS包对用户体验的影响主要包括：资源体积、网络下载时间、JS解析、编译/执行、React渲染、页面可交互

- 使用工具分析Bundle 为了确定是那些依赖导致主包体积过大，下载npm install -D rollup-plugin-visualizer 通过构建生成Bundle可视化分析文件 stats.html 通过分析图看到主要包括 Markdown 渲染相关依赖、代码高亮相关依赖、KaTeX、数学公式相关依赖、UI、组件及其依赖、React 及项目自身代码，其中 1.代码高亮 为了支持各种语言需要包含各种语言以及对应的 语法规则、解析逻辑、高亮规则 因为支持语言越多，最终Bundle体积越大。2.Markdown 
前端需要通过 Markdown 渲染器将这些文本解析成 React 可以渲染的结构。因此 Markdown 渲染相关依赖也会进入 Bundle。其中也包括数学公式和各种字体资源。

- 考虑优化方案 
    1. 删除部分依赖。例如减少支持的不常用语言、删除数学公式支持、删除部分 Markdown 功能 优点是：直接减少Bundle体积、实现简单、不需要增加运行时加载逻辑。缺点是：会直接影响产品功能。并且希望项目本身支持多语言和数学公式，所以不采用该方案
    2. 路由懒加载。默认情况下，所有页面都是普通静态导入，所以这些相关代码可能会在页面初始加载时一起进入Bundle。可以使用 React.lazy() 配合 dynamic import() 实现进入首页只加载首页需要的代码，进入其他页面在加载其他页面相关代码。优点是：减少初始JS下载量，改善首屏加载性能，适合页面较多的应用。缺点：首次访问对应页面时需要下载额外资源，对当前项目来说页面较少且大部分功能集中在chat页面，所以路由懒加载带来的效果有限。
    3. 功能模块懒加载。如 Markdown、代码高亮、KaTex 可以不在应用启动时立即加载，而是在需要使用是再加载，本质也是import()动态导入 例如：const module = await import("./heavyModule"); 或者使用React：const HeavyComponent = lazy(() => import("./HeavyComponent")); 核心思想都是: 将原本“应用启动时加载”的资源，推迟到真正需要时加载。
    4. 空闲时间预加载。requestIdCallback 核心思路 首屏优先加载核心功能 -> 页面完成主要渲染 -> 浏览器进入空闲状态 -> 提前加载未来可能需要的大型模块。优点：相比使用时加载，空闲预加载可以提前完成资源加载，减少回复的时间。缺点：实现和资源管理更复杂、浏览器空闲时间不确定、如果用户根本不使用对应功能，可能产生无效加载、当前项目规模下优化收益可能有限

- 最终决定没有立即优化。经过进一步测试生产环境的首屏性能，测试环境包括 Production Build 桌面端浏览器 正常网络环境 通过浏览器 Performance / Linghthouse等工具观察时机加载表现。最终发现 虽然 主Bundle体积较大，并且Vite给出超过500KB的警告，但在当前项目规模和测试环境下，没有明显的首屏加载性能问题
- 原因：
    1. 当前首屏实际体验可以接受
    2. 当前项目规模较小
    3. 聊天场景对Markdown功能依赖较高
    4. 避免过度优化 优化性能需要考虑 优化收益、实现复杂度、维护成本
        - 当前项目的主要真实性能问题并不是首屏加载，而是聊天记录持续增加，页面中同时存在大量消息、Markdown 节点和代码内容，可能导致 DOM 数量增加和渲染性能下降。

- 如果未来项目规模扩大 可以根据实际情况、产生性能问题的主要原因参考上述优化方案进行优化


# 包体积过大的简历版本
- 对生产构建产物进行性能分析，发现主 Bundle 超过 1.4MB，通过 Rollup Visualizer 定位 Markdown、代码高亮和 KaTeX 等依赖的体积占比，并结合生产环境首屏性能数据评估代码分割和懒加载方案，最终基于实际收益与复杂度决定暂不进行过度优化。

-   1. 第一层：发现问题

    - 我在项目完成后执行生产构建时，Vite 提示有一个 JavaScript chunk 超过了 500KB，最终主 Bundle 大约是 1.48MB，所以我开始关注首屏资源体积的问题。

    2. 第二层：分析原因

    - 我没有直接去拆包，而是先使用 Rollup Plugin Visualizer 分析 Bundle，发现主要体积来自 Markdown 渲染、代码高亮、KaTeX 和一些 UI 相关依赖。其中代码高亮需要支持多种语言，所以包含了较多语言相关代码，KaTeX 还带来了字体资源。

    3. 第三层：提出方案

    - 当时考虑过路由懒加载、动态 import、React.lazy、按需加载代码语言，以及浏览器空闲时预加载等方案。

    4. 第四层：为什么没有直接优化

    - 但是我觉得 Bundle 超过 500KB 只是一个构建警告，不代表一定存在用户可感知的性能问题，所以又测试了生产环境下的实际首屏表现。

    5. 第五层：最终决策

    - 最后发现当前项目规模比较小，主要功能集中在聊天页面，桌面端实际首屏体验可以接受。如果强行拆分 Markdown、代码高亮等模块，可能只是把加载时间从首屏转移到用户第一次收到代码或公式的时候。因此权衡收益和复杂度后，我暂时没有做激进的拆包优化，把重点放到了项目中更明显的“大量聊天消息导致渲染压力增加”这个问题上。

# 核心思维
## 性能优化不是看到指标异常就立即修改代码，而是先确认指标是否真正影响用户体验，再通过测量和分析定位瓶颈，最后结合优化收益、实现复杂度和维护成本做出决策。

## 性能优化不是优化“耗时最大的函数”，而是找到“为什么产生了这么多不必要的工作”。


# 经过大量数据、多种类型数据的压力测试
## 性能问题初步定位
- 通过 DeveloTools Performance 对大量历史消息场景进行录制，发现切换会话和滚动过程中存在明显卡顿


## 切换会话推理链

- 我做的是「切换会话」
        ↓
- 为什么切换会卡？
        ↓
- 可能原因：
    ├─ 大量 DOM 节点
    ├─ 大量组件重新渲染
    ├─ Markdown 重新解析
    ├─ 代码高亮
    ├─ IndexedDB 查询
    ├─ 大量 JavaScript 计算
    └─ 其他浏览器工作
        ↓
- Profiler 告诉我 CPU 到底在干什么
        ↓
- Call Tree 发现 SyntaxHighlighter
        ↓
- 查看代码我的项目确实大量使用代码高亮
        ↓
- SyntaxHighlighter 在调用链里占据了比较明显的位置
        ↓
- 所以：
「代码高亮导致切换会话卡顿」
 成为一个合理的怀疑

## Firefox 采样（sampling）
- Performance里的采样，就是浏览器每隔一小段时间“偷拍一次”当前JavaScript主线程正在执行什么，然后用这些照片统计：那些函数最经常出现在CPU执行现场


## Performance Optimization

### 场景

切换到包含大量历史消息和代码块的会话。

### Baseline

- Browser: Firefox
- Build: Development Build
- Test data: 固定会话
- Action: 切换会话

| 指标 | Baseline |
|---|---:|
| Total samples | 469 |
| SyntaxHighlighter | 189 |
| DefaultRenderer | 156 |
| createElement | 154 |

主要热点：

SyntaxHighlighter
→ DefaultRenderer
→ createElement

### Hypothesis

切换大量历史消息时，每个代码块都会经过
SyntaxHighlighter 进行语法高亮。

大量代码块可能导致大量 React Element 创建，
从而增加 CPU 开销。

### 甲 A/B Experiment

临时将 SyntaxHighlighter 替换为原生：

<pre>
  <code>
</pre>

其他代码保持不变。

### 乙 A/B Experiment 

通过 
```js
const visibleMessages = messages.slice(-10);
``` 
只渲染最后十条消息

其他代码不变
### Experiment Result

| 指标 | 原版 | 甲: code替换lightheight实验版 | 乙: 只渲染最后十条消息实验版 |
|---|---:|---:|---:|
| Total samples | 469 | 116 | 239 |
| SyntaxHighlighter | 189 | 消失 | 102 |
| Markdown | - | 80 |  |
| micromark | - | 43 |  |
| 点击到完整展现 | 约1423ms | 约213ms | 约731ms |
Total samples 从 469 降至 116，
下降约 75%。

### Conclusion

- 甲实验结果支持原假设：

    SyntaxHighlighter 是当前场景的重要性能热点。
    但实验版本删除了代码高亮功能，
    因此不能直接作为最终方案。

- 乙实验结果

    将渲染消息数量减少后，Total samples 下降约 49%
    SyntaxHighlighter samples 下降约 46%
    说明一次性渲染大量历史消息是会话切换 CPU 开销的重要来源
    SyntaxHighlighter 是当前渲染过程中的主要热点之一


## 总结
- 当前会话切换的性能开销主要来自大量历史消息的一次性渲染，其中 Markdown 解析和 SyntaxHighlighter 又是每条消息渲染过程中的高成本环节。


# 优化
## 实验1：为CodeBlock添加React.memo
- 结果：第一次切换会话的profiler指标没有明显下降，SyntaxHightLighter、Defaultrenderer、createElement仍占据主要CPU成本
- 结论：第一次切换会话的主要成本并非已经挂载的CodeBlock重复更新，而是大量历史消息首次渲染时产生的Markdown/代码块解析及SyntaxHightlght工作。因此React.memo暂不作为主要优化手段。

## 实验2：为CodeBlock添加延迟高亮
- 结果：从开始切换会话到切换会话完成，白屏时间降低很多，但如代码块高亮过多，还是会有很长的时间等待代码从普通到高亮
- 数据：从点击会话到完整显示会话的时间约为 823ms
- 结论：进一步证明普通聊天切换会话成本很低，代码高亮会极大地放大消息数量过大的渲染成本。总结延迟高亮有效提高用户体验，但后续可以/需要结合其他方案进一步优化

## 实验3：基于视口的延迟高亮
- 结果：进一步加快了从点击切换会话到完成的时间，但这个过程多了一个从A的消息到B的普通消息再到B的高亮消息的过程，会有一个明显的感觉，但影响不大
- 数据：完整时间由 约1.4s 到 约630ms 用户感知切换时间降低 约55%
- 结论：当前规模下继续增加缓存复杂度收益有限

# 最终方案为 基于视口的延迟高亮

# 发现首次白屏时间长达2分钟左右
- 首屏加载慢 → Network（网络）发现 @lobehub/icons 超过 25 MB → 搜索项目引用 → 发现 state.html 引用了大量 icons → 判断是上次 Bundle Analysis（包体积分析）生成的残留文件 → 删除 → 首屏恢复正常


# 简历
- 性能分析与优化： 使用 Firefox Profiler、DevTools Network 对大量消息场景进行性能定位，通过 Call Tree（调用树）定位 Markdown / Syntax Highlighting（语法高亮）等渲染开销，并针对代码块实现视口级延迟高亮；同时排查开发环境首屏异常加载，定位到历史 Bundle Analysis（包体积分析）产物 state.html 引入大量 @lobehub/icons，清理残留分析产物后恢复正常。




# 2026-9-1

## 测试的核心意义：
- 防止以后修改代码时把已经正常的功能改坏

## 项目内做的测试

- 主要针对项目的核心链路做了测试。首先对流式AI回复的parseSSE做了纯函数测试，重点覆盖了跨chunk数据、[DONE]、非法JSON等边界情况；其次对Dexie数据层进行了测试，验证消息写入、会话删除以及关联消息的清理;最后对Zustand store 做了状态逻辑测试。测试环境使用fake-indexeddb模拟IndexDB,并通过mock隔离非核心的事件副作用

## 为什么不直接测试UI？

- 因为这几个逻辑本身和UI没有强耦合。比如parseSSE是纯函数，直接测试输入输出成本更低；Zustand store 也可以直接通过getState()测试状态变化。这样测试更稳定，也更容易定位问题。

### UI测试的优势
- 更接近真实用户使用系统的方式

## 为什么测试数据有没有正确解析、数据有没有正确存储、状态有没有正确变化这三个部分？

1. 数据有没有解析是流式聊天的基础设施
2. 有没有正确存储是持久化层(Persistence Layer) 确保数据正常显示


## 测试出错，怎么看？怎么解决？

- 运行 npm run test 

## Vitest(一个 JavaScript / TypeScript 测试框架)

- 提供测试语法 包括describe、beforeEach、it、expect
- vi.mock 模拟依赖
- fake-indexeddb 在Node中模拟IndexedDb
- getState() 直接读取Zustand状态
- buffer 暂存不完整的流式数据

## 测试结构
- AAA Pattern
- 准备(Arrange) -> 执行(Act) -> 断言(Assert)

## 单元测试
- 主要回答这个函数对不对
## 集成测试
- 这些模块组合起来对不对
## UI/组件测试
- 这个组件在用户操作后对不对
## E2E 
- 用户从头到尾完成这个操作对不对