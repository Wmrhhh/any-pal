# AnyPal

A WeChat-style multi-functional workspace where every feature is a contact.

Chat with AI (DeepSeek, and more coming soon) or use local tools — all in one familiar contact list interface.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)

## Features

- **WeChat-Style UI** — Familiar contact list layout, dark theme, clean and intuitive
- **AI Chat** — Powered by DeepSeek API, with support for more LLM providers coming soon
- **Contact = Feature** — Every function appears as a contact in your list. Tap to open, just like messaging a friend
- **Local Tools** — Not everything needs an API. Built-in utilities work offline
- **Extensible** — Easy to add new "contacts" (features) to your workspace

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + Node.js
- **Icons:** Lucide React + LobeHub Icons

## Quick Start

### Prerequisites

- Node.js 18+
- A DeepSeek API key (for AI chat features)

### Installation

```bash
# Clone the repo
git clone https://github.com/Wmrhhh/any-pal.git
cd any-pal

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Configuration

Create a `.env` file in the `server/` directory:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

> **Note:** `server/.env` is already in `.gitignore`. Never commit your API keys.

### Run

```bash
# Terminal 1: Start the backend
cd server
npm run dev

# Terminal 2: Start the frontend (from project root)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
any-pal/
├── src/                    # Frontend source
│   ├── component/          # React components
│   │   ├── ChatList.tsx    # Contact list sidebar
│   │   ├── RightContent.tsx # Main content area
│   │   ├── Chat.tsx        # Chat interface
│   │   └── MessageBox.tsx  # Message input & display
│   ├── App.tsx
│   └── main.tsx
├── server/                 # Backend source
│   ├── routes/
│   │   └── chat.js         # Chat API routes
│   ├── index.js            # Express server entry
│   └── .env                # API keys (ignored by git)
├── public/                 # Static assets
└── dist/                   # Production build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `cd server && npm run dev` | Start backend dev server |
| `cd server && npm start` | Start backend in production |

## Roadmap

- [x] WeChat-style contact list UI
- [x] DeepSeek AI chat integration
- [ ] Support for more LLM providers (OpenAI, Claude, etc.)
- [ ] Local tools (calculator, notes, translator, etc.)
- [ ] Message history persistence
- [ ] Customizable contact avatars and names
- [ ] Mobile-responsive layout

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

[MIT](LICENSE)
