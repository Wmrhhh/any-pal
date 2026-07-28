// main.tsx负责启动React应用
import App from "./App"
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root')!).render(
  <App />
)