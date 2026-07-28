import { type ReactNode, useEffect } from "react";
import { useThemeStore } from "../store/chatStore";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

  }, [theme])

  // 提供能力而不是创造额外的DOM结构--关于为什么只返回children
  return children
}