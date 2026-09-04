import { useState, useEffect, useRef, type ReactNode } from "react";

// 引入样式
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// 代码高亮
// 运行时使用 react-syntax-highlighter；
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
}
function CodeBlock({ children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  // 先转字符串，因为children可能是 ReactNode
  // 去掉多余换行
  const code = String(children).replace(/\n$/, "");
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("复制失败", error);
    }
  }

  const [heightlighted, setHeightlighted] = useState(false)
  const codeBlockRef = useRef<HTMLDivElement>(null)

  // 视口懒高亮
  useEffect(() => {
    // 拿到当前这个CodeBlock对应的DOM元素
    const element = codeBlockRef.current;

    if (!element) return;

    // IntersectionObserver(交叉观察器)是浏览器提供的API
    // 告诉我们某个元素是不是进入了观察区域
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // 如果进入观察区域那么 entry.isIntersecting === true
        if (entry.isIntersecting) {
          setHeightlighted(true)
          observer.disconnect();
        }

      },
      // 把观察区向外扩展200px
      // Prefetch/Pre-render(提前准备)思想
      {
        rootMargin: "200px",
      }
    );
    observer.observe(element);
    return () => {
      // 不需要持续观察，关闭观察器
      observer.disconnect()
    }

  }, [])
  // 延迟高亮
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setHeightlighted(true)
  //   }, 0)

  //   return () => clearTimeout(timer)
  // })
  return (
    <div
      ref={codeBlockRef}
      className="my-4 rounded-xl overflow-hidden border border-[#3a3a3c] bg-[#18181b]"
    >
      {/* 顶部栏 */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#242426] text-sm text-[#a1a1aa] border-b border-[#3a3a3c]">
        <span className="font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="px-2 py-1 rounder-md  text-xs hover:bg-[#3a3a3c] transition"
        >
          {copied ? "复制成功" : "复制"}
        </button>
      </div>
      {/* 代码区域 */}
      {/* syntaxHightlighter内部生成了 pre code span */}
      {heightlighted ? (
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            background: "#18181b",
            borderRadius: "12px",
            padding: "16px",
            margin: 0,
          }}
        >
          {code}
        </SyntaxHighlighter>
        // <code>{code}</code>
      ) : (
        <code>{code}</code>
      )
      }
    </div>
  );
}

export default CodeBlock