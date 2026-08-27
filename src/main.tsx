// main.tsx负责启动React应用
import App from "./App";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import ErrorBoundary from "./components/ErrorBoundary";


createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
