## 项目简介

**AnyPal 是一个面向 AI 对话场景打造的现代化 Chat 应用。**

它不仅实现了基础的 AI 对话，还围绕真实的聊天应用场景，完整实践了 **多模型切换、SSE 流式响应、Markdown/代码高亮、本地数据持久化以及前端性能优化** 等能力。

从用户发送一条消息，到 AI 回复逐字生成，再到会话历史被持久化保存，AnyPal 将整个 AI Chat 的核心链路串联起来，并针对真实使用过程中出现的性能问题进行了分析与优化。

在开发过程中，我使用 **Firefox Profiler** 对会话切换和消息渲染进行性能分析，定位 Markdown 与 Syntax Highlighting 带来的渲染开销，并通过 `IntersectionObserver` 实现 **Viewport-based Lazy Highlighting**，减少大量历史代码块同时进行语法高亮造成的性能压力。

同时，项目使用 **Dexie + IndexedDB** 构建本地数据层，并通过 **Zustand** 管理跨组件状态，使会话、消息和模型选择等数据能够保持清晰的职责划分。

> **AnyPal 不只是一个 AI Chat Demo，更是一次围绕 AI 前端应用进行完整工程实践的项目。**


## Features

### AI 对话

- 支持 DeepSeek 与 Kimi 多模型对话
- 不同会话可以独立选择 AI 模型
- 支持 SSE 流式响应，实时展示 AI 生成内容

### Rich Message Rendering

- 支持 Markdown / GFM
- 支持代码块与语法高亮
- 支持数学公式与 KaTeX
- 支持表格、列表、引用、链接等常见 Markdown 内容

### Conversation Management

- 创建、删除和切换会话
- 根据首条用户消息自动生成会话副标题
- 会话按照最近更新时间排序
- 不同会话独立保存聊天记录

### Local Persistence

- 使用 IndexedDB 持久化会话和消息
- 使用 Dexie 简化数据库操作
- 使用复合索引优化消息查询
- 使用事务保证会话与消息删除的一致性

### Performance

- 使用 Firefox Profiler 分析消息渲染性能
- 针对 Syntax Highlighting（语法高亮）进行性能优化
- 使用 `IntersectionObserver` 实现视口懒高亮
- 减少大量历史代码块同时进行语法高亮造成的渲染开销

### Engineering

- TypeScript 类型检查
- ESLint 代码检查
- Prettier 代码格式化
- Vitest 单元测试
- 核心 SSE 解析、数据层和状态管理逻辑均有测试覆盖


## Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 | UI 构建与组件化开发 |
| Language | TypeScript | 类型安全与代码可维护性 |
| Build Tool | Vite | 开发环境与生产构建 |
| Styling | Tailwind CSS | UI 样式开发 |
| Routing | React Router | 页面与路由管理 |
| State Management | Zustand | 管理会话、模型等全局状态 |
| Local Database | Dexie + IndexedDB | 本地会话与消息持久化 |
| Markdown | React Markdown | Markdown 内容渲染 |
| Syntax Highlighting | React Syntax Highlighter | 代码语法高亮 |
| Math Rendering | KaTeX | 数学公式渲染 |
| Backend | Express | AI API 请求代理与流式响应转发 |
| Testing | Vitest | 核心逻辑单元测试 |
| Code Quality | ESLint + Prettier | 代码检查与格式化 |


## Architecture

AnyPal 采用前后端分离架构。

前端负责 UI 渲染、用户交互、本地数据管理以及 AI 流式响应的展示；后端负责 AI API 的统一代理、模型配置以及 SSE 流式响应转发。

### Core Data Flow

```text
User Input
    ↓
React UI
    ↓
Add User Message
    ├──→ IndexedDB
    │
    └──→ POST /api/chat
              ↓
        Express Backend
              ↓
        DeepSeek / Kimi
              ↓
          SSE Stream
              ↓
      Streaming UI Update
              ↓
      Persist Final Message
              ↓
          IndexedDB
  ```

### Main Responsibilities

- **React**
  - 负责页面结构、组件渲染和用户交互

- **Zustand**
  - 管理当前会话、模型选择和主题等跨组件状态

- **Dexie / IndexedDB**
  - 持久化 Conversation（会话）和 Message（消息）
  - 负责历史消息查询、会话创建和删除

- **Express**
  - 作为前端与 AI API 之间的服务端代理
  - 统一管理不同 AI 模型的 API 配置
  - 将上游模型的流式响应转发给前端

- **SSE Parser**
  - 处理网络层返回的数据块
  - 解决单个 SSE 消息被拆分到多个网络 chunk（数据块）中的情况
  - 将解析后的内容持续交给 React UI

- **Markdown Renderer**
  - 将 AI 返回的 Markdown 转换为 React 元素
  - 支持 GFM、数学公式、代码块和语法高亮


## Project Structure

```text
any-pal/
├── src/
│   ├── components/
│   │   ├── Markdown/
│   │   │   ├── CodeBlock.tsx
│   │   │   └── Markdown.tsx
│   │   ├── Chat.tsx
│   │   ├── ChatList.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── MessageBox.tsx
│   │   ├── MessageItem.tsx
│   │   ├── SearchBox.tsx
│   │   ├── SettingMenu.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ToolList.tsx
│   │
│   ├── db/
│   │   ├── db.ts
│   │   └── useChatDB.ts
│   │
│   ├── hooks/
│   │   └── useMessages.ts
│   │
│   ├── pages/
│   │   └── ...
│   │
│   ├── store/
│   │   └── chatStore.ts
│   │
│   ├── utils/
│   │   ├── events.ts
│   │   └── parseSSE.ts
│   │
│   ├── test/
│   │   └── setup.ts
│   │
│   ├── router.tsx
│   └── main.tsx
│
├── server/
│   ├── routes/
│   │   ├── chat.js
│   │   └── summarySubtitle.js
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── think.md
│
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── eslint.config.js
└── README.md
 ```

### Directory Responsibilities

- **`src/components/`**
  - 页面 UI 和业务组件
  - `Markdown/` 独立负责 AI 消息的 Markdown 渲染和代码块处理

- **`src/db/`**
  - IndexedDB 数据层
  - 负责 Conversation（会话）和 Message（消息）的增删改查

- **`src/hooks/`**
  - 封装可复用的业务逻辑
  - `useMessages` 负责当前会话消息的读取与更新

- **`src/store/`**
  - Zustand 全局状态
  - 管理当前会话、模型选择和主题等状态

- **`src/utils/`**
  - 通用工具函数
  - `parseSSE.ts` 负责 SSE 流式数据解析
  - `events.ts` 负责前端数据更新事件通信

- **`src/test/`**
  - 测试环境初始化
  - 提供 IndexedDB 等测试环境依赖

- **`server/`**
  - Express 后端
  - 负责 AI API 请求代理和流式响应转发
  - `routes/chat.js` 处理 AI 对话请求
  - `routes/summarySubtitle.js` 负责生成会话副标题

- **`docs/`**
  - 项目开发过程中的设计思考与技术记录


## Core Implementation

### SSE Streaming

AnyPal 使用 SSE（Server-Sent Events，服务器推送事件）实现 AI 回复的流式传输。

用户发送消息后，前端通过 `fetch` 向后端发送请求，Express 后端再向对应的 AI 模型 API 发起流式请求，并将上游返回的数据持续转发给浏览器。

```text
User
  ↓
fetch("/api/chat")
  ↓
Express Backend
  ↓
AI Model API
  ↓
Streaming Response
  ↓
Express res.write()
  ↓
ReadableStream
  ↓
TextDecoder
  ↓
parseSSE()
  ↓
Update Streaming UI
 ```

#### Streaming Flow

1. 前端将当前会话的消息和选中的模型发送到 `/api/chat`

2. Express 后端根据模型配置向 DeepSeek 或 Kimi API 发起 `stream: true` 请求

3. 后端设置 `text/event-stream` 响应头，并持续将上游数据写入 HTTP Response

4. 前端通过 `response.body.getReader()` 获取 `ReadableStream（可读流）`

5. 使用 `TextDecoder` 将接收到的二进制数据块转换为文本

6. 由于一次网络读取不一定对应完整的 SSE 消息，因此使用 `parseSSE` 维护 Buffer（缓冲区），处理跨 chunk（数据块）的 SSE 消息

7. 解析出 `delta.content` 后，持续更新当前的 `streamingReply`，实现 AI 回复的实时展示

8. 流结束后，将完整的 AI 回复持久化到 IndexedDB

#### Handling Chunk Boundaries

网络层返回的数据并不保证按照 SSE 消息边界到达。

例如，一条完整的 SSE 消息可能被拆分到多个 chunk 中：

```text
Chunk 1:
data: {"choices":[{"delta":{"content":"Hel

Chunk 2:
lo"}}]}
 ```
因此 parseSSE 不会直接对每一个 chunk 进行 JSON 解析，而是维护一个 Buffer（缓冲区）：

Incoming Chunk
      ↓
Append to Buffer
      ↓
Split by "\n\n"
      ↓
Extract Complete SSE Messages
      ↓
Keep Incomplete Message in Buffer
      ↓
JSON.parse()
      ↓
Extract delta.content

这种方式可以避免因为网络 chunk 边界与 SSE 消息边界不一致而导致解析失败。

### Error Handling

parseSSE 同时处理以下情况：

1. SSE 消息跨多个网络 chunk
2. 单个 chunk 包含多个 SSE 消息
3. [DONE] 结束标记
4. 缺少 delta.content 的消息
5. 无效 JSON
6. 不完整的 SSE 数据


### IndexedDB Persistence

AnyPal 使用 **IndexedDB** 保存 Conversation 和 Message ，并使用 **Dexie** 对 IndexedDB 进行封装。

这样可以让聊天记录直接持久化在浏览器本地，即使刷新页面，也可以恢复之前的会话和消息。

#### Data Model

项目主要包含两个核心数据表：

```text
Conversation
├── id
├── name
├── subtitle
├── createdAt
└── updatedAt

Message
├── id
├── conversationId
├── role
├── content
├── createdAt
└── model
```

`Conversation` 和 `Message` 通过 `conversationId` 建立关联。

#### Message Query

查询当前会话的消息时，使用 Dexie 的复合索引：

```text
[conversationId+createdAt]
```

查询过程可以表示为：

```text
Current Conversation ID
          ↓
[conversationId + createdAt] Composite Index
          ↓
Query Messages of Current Conversation
          ↓
Return in createdAt Order
          ↓
Render Message List
```

通过复合索引，可以直接定位指定会话的消息，而不需要先读取全部消息再在 JavaScript 中进行过滤。

#### Transactional Deletion

删除会话时，需要同时删除：

1. Conversation 记录
2. 该会话对应的所有 Message 

因此使用 Dexie Transaction 保证两个操作的一致性：

```text
Delete Conversation
        ↓
┌───────────────────────┐
│     Transaction       │
│                       │
│ Delete Conversation   │
│         +             │
│ Delete Related Msgs   │
│                       │
└───────────────────────┘
        ↓
     Commit
```

如果事务中的操作发生异常，事务可以回滚，避免出现 Conversation 已删除但 Message 仍然残留的数据不一致问题。

#### Data Synchronization

消息和会话数据发生变化后，通过自定义事件通知相关组件重新读取数据：

```text
Database Update
      ↓
emitConversationsUpdated()
      ↓
Custom Event
      ↓
useMessages / Conversation List
      ↓
Reload Data
      ↓
Update UI
```

这种方式避免了不同组件之间直接依赖彼此的内部状态，使数据库层和 UI 层保持相对独立。


### State Management

AnyPal 使用 **Zustand** 管理需要在多个组件之间共享的客户端状态。

项目没有将所有数据都放入全局状态，而是根据数据的职责进行划分：

```text
                    Application State
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
        Zustand Store              IndexedDB
       （运行时状态）              （持久化数据）
              │                         │
      ┌───────┼───────┐          ┌──────┴──────┐
      ↓       ↓       ↓          ↓             ↓
   当前会话  模型选择  主题      Conversation   Message
```

#### Zustand State

Zustand 主要保存应用运行过程中需要快速访问和更新的状态：

- 当前选中的 Conversation（会话）
- 不同会话对应的模型选择
- 当前 Theme（主题）

这些状态具有明显的运行时特征，不需要直接作为聊天历史长期保存。

#### IndexedDB Data

Conversation 和 Message 属于需要持久化保存的业务数据，因此由 IndexedDB 负责存储。

这样可以避免将大量聊天记录长期保存在 Zustand Store 中，也可以让页面刷新后重新从本地数据库恢复聊天数据。

#### State Separation

项目将运行时状态和持久化数据进行分离：

```text
Zustand
  ↓
负责「当前应用正在使用什么状态」

IndexedDB
  ↓
负责「应用历史上保存了什么数据」
```

这种划分可以降低全局状态的复杂度，并明确 UI 状态与业务数据之间的职责边界。


### Markdown Rendering

AnyPal 使用 `react-markdown` 构建 Markdown 渲染链路，并通过 `remark-gfm`、`remark-math` 和 `rehype-katex` 扩展 Markdown 能力。

```text
Markdown String
      ↓
react-markdown
      ↓
┌─────┴──────────────┐
↓                    ↓
remark-gfm       remark-math
↓                    ↓
GFM Syntax       Math Syntax
                     ↓
                rehype-katex
                     ↓
                  KaTeX
```

项目支持：

- GFM（GitHub Flavored Markdown）
- Tables（表格）
- Lists（列表）
- Blockquotes（引用）
- Links（链接）
- Code Blocks（代码块）
- Mathematical Formulas（数学公式）

#### Code Block Rendering

代码块由独立的 `CodeBlock` 组件负责，并使用 `react-syntax-highlighter` 实现语法高亮。

为了减少大量历史代码块同时进行语法高亮造成的渲染开销，项目使用 `IntersectionObserver` 实现 Viewport-based Lazy Highlighting（基于视口的懒高亮）：

```text
Code Block
    ↓
Initial Plain Rendering
    ↓
IntersectionObserver
    ↓
Enter Viewport / Near Viewport
    ↓
Syntax Highlighting
```

这样可以将 Syntax Highlighting（语法高亮）的开销从页面初始渲染阶段延后到代码块真正需要展示时。


## Performance Optimization

项目针对历史会话包含大量 Markdown、代码块时可能出现的渲染性能问题进行了分析和优化。

### Conversation Rendering

在开发过程中，通过 Firefox Profiler（性能分析工具）对会话切换过程进行分析，发现大量历史消息同时进行 Markdown Rendering（Markdown 渲染）和 Syntax Highlighting（语法高亮）会增加主线程的渲染开销。

性能分析表明，`SyntaxHighlighter` 是其中较明显的计算开销来源之一。

```text
Switch Conversation
        ↓
Load Message History
        ↓
Render Large Message List
        ↓
Markdown Parsing
        ↓
Syntax Highlighting
        ↓
Main Thread Workload
```

因此没有直接移除代码高亮，而是针对 Syntax Highlighting 进行延迟处理。

### Viewport-based Lazy Highlighting

项目使用 `IntersectionObserver` 实现 Viewport-based Lazy Highlighting（基于视口的懒高亮）。

代码块首次渲染时先显示普通代码，当代码块进入视口附近后，再执行 Syntax Highlighting（语法高亮）。

```text
Code Block
     ↓
Initial Plain Rendering
     ↓
IntersectionObserver
     ↓
Enter Viewport / Near Viewport
     ↓
Syntax Highlighting
     ↓
Highlighted Code
```

同时设置 `rootMargin: 200px`，让代码块在进入实际视口之前提前进行高亮处理，减少用户滚动到代码块时出现明显延迟的可能。

这种方案保留了完整的代码高亮能力，同时避免历史会话中的所有代码块在首次渲染时同时执行高亮。

### Bundle Analysis

除了运行时性能之外，还对 Production Bundle（生产环境打包产物）进行了分析。

使用 `rollup-plugin-visualizer` 生成 Bundle Analysis（包体积分析）结果，对依赖体积和模块构成进行检查。

分析过程中发现：

- `react-syntax-highlighter` 及其相关语言解析模块占据较大的 Bundle 体积
- KaTeX 等 Markdown 相关依赖也会增加最终打包体积
- 大型第三方依赖需要结合实际运行时性能和功能需求进行权衡

项目没有仅根据 Bundle Size（包体积）盲目删除功能，而是结合实际使用场景进行分析，在功能完整性和性能之间进行取舍。

### Performance Debugging

开发过程中也对异常的首次加载问题进行过排查。

当本地页面出现异常加载缓慢时，通过 Network（网络）面板定位到异常的大体积资源，再进一步追踪资源来源，最终发现是之前 Bundle Analysis 生成的本地分析文件残留，而不是应用运行时依赖本身导致的问题。

这一过程也验证了性能优化中的一个重要原则：

> **先测量和定位问题，再决定是否优化。**


## Testing

项目使用 **Vitest** 对核心业务逻辑进行测试，共包含 28 个测试用例。

测试重点放在数据处理和业务逻辑层，而不是对所有 UI 组件进行测试。

### Test Coverage

#### SSE Parser

`parseSSE` 是项目中独立的纯函数，因此优先进行完整测试。

测试覆盖：

- 正常 SSE 消息解析
- 多条 SSE 消息连续到达
- 单条 SSE 消息跨多个 chunk
- 一个 chunk 包含多条 SSE 消息
- `[DONE]` 结束标记
- 缺少 `delta.content`
- 无效 JSON
- 不完整 SSE 数据

#### IndexedDB Data Layer

对 `useChatDB` 中的核心数据操作进行测试。

测试覆盖：

- 创建 Conversation（会话）
- 添加 Message（消息）
- 更新 Conversation 的 `updatedAt`
- 更新 Message Count（消息数量）
- 删除 Conversation 及其关联 Message
- 删除会话时保留其他会话的数据
- 空会话复用逻辑
- 默认模型设置

测试环境使用 `fake-indexeddb` 模拟浏览器 IndexedDB，使数据层可以在 Node.js 测试环境中运行。

#### Zustand Store

对 `chatStore` 中的状态逻辑进行测试。

测试覆盖：

- 初始状态
- 当前会话切换
- 当前会话清空
- 模型选择更新
- 不同会话之间模型状态的独立性
- Theme（主题）状态切换

### Testing Strategy

项目没有追求对所有代码进行测试，而是优先覆盖：

```text
High-value Business Logic
          ↓
     Pure Functions
          ↓
      Data Layer
          ↓
      State Logic
          ↓
        Tests
```

这样可以在较低测试成本下覆盖对应用行为影响较大的核心逻辑，同时避免大量 UI 测试带来的维护成本。

### Run Tests

运行测试：

```bash
npm run test
```

运行一次测试并退出：

```bash
npm run test:run
```

当前测试结果：

```text
28 tests passed
```


## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Wmrhhh/any-pal.git
cd any-pal
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
cd ..
```

### Environment Variables

Copy the example environment file:

```bash
cd server
Copy `server/.env.example` to `server/.env`, then configure the required API keys.
```

Then configure the required API keys in `server/.env`.

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
KIMI_API_KEY=your_kimi_api_key
```

> Do not commit `.env` or any API keys to the repository.

### Start the Development Server

Start the backend:

```bash
cd server
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

In another terminal, start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

### Production Build

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```


## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 执行 TypeScript 类型检查并构建生产版本 |
| `npm run preview` | 预览生产构建结果 |
| `npm run lint` | 使用 ESLint 检查代码 |
| `npm run format` | 使用 Prettier 格式化代码 |
| `npm run format:check` | 检查代码格式是否符合 Prettier 规范 |
| `npm run test` | 运行 Vitest 测试并进入监听模式 |
| `npm run test:run` | 执行一次完整测试并退出 |


## Engineering Practices

- **Type Safety**
  - 使用 TypeScript 进行类型约束，减少运行时错误

- **Code Quality**
  - 使用 ESLint 进行代码质量检查
  - 使用 Prettier 统一代码格式

- **Environment Configuration**
  - 使用 `.env` 管理 API Key 等敏感配置
  - 提供 `.env.example` 作为环境变量配置示例
  - `.env` 不提交到 Git 仓库

- **Error Handling**
  - 使用 React Error Boundary（错误边界）捕获组件渲染过程中的异常
  - 避免单个组件异常导致整个应用无法正常使用

- **Layered Architecture**
  - 将 UI、状态管理、数据持久化和后端 API 请求进行职责划分
  - 减少组件之间的直接依赖

- **Testing**
  - 使用 Vitest 对核心业务逻辑进行测试
  - 优先测试 SSE Parser、IndexedDB Data Layer 和 Zustand Store 等高价值逻辑

- **Performance Profiling**
  - 使用 Firefox Profiler 对真实渲染过程进行性能分析
  - 根据 Profiling（性能分析）结果定位瓶颈，而不是仅凭主观感受进行优化

- **Git Workflow**
  - 使用 Git 管理项目版本
  - 通过 GitHub 维护项目代码和开发记录


## License

This project is for learning and engineering practice.