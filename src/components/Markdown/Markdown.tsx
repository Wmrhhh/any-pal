// 引入markdown库
import ReactMarkdown from "react-markdown";
// 引入github扩展markdown库
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // 处理引用
        blockquote({ children }) {
          return (
            <blockquote className="my-4 border-l-4 border-gray-400 pl-4 text-gray-400 italic text-[14px]">
              {children}
            </blockquote>
          );
        },

        // 处理链接a
        a({ href, children }) {
          return (
            <a
              href={href}
              // 作用：点击链接时，在新的浏览器标签页打开
              target="_blank"
              // 告诉浏览器： 不要告诉新页面我是从哪里来的，也不要建立opener关系 防止被恶意攻击
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {children}
            </a>
          );
        },

        // 处理无序列表
        ul({ children }) {
          return <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>;
        },

        // 处理有序列表
        ol({ children }) {
          return <ol className="list-decimal pl-6 my-3">{children}</ol>;
        },

        // 处理普通段落
        p({ children }) {
          return <p className="leading-7">{children}</p>;
        },

        // 处理h1标题
        h1({ children }) {
          return <h1 className="text-2xl font-bold my-5">{children}</h1>;
        },

        // 处理h2标题
        h2({ children }) {
          return <h2 className="text-xl font-bold my-4">{children}</h2>;
        },

        // 处理横线
        hr() {
          return <hr className="my-4 border-zinc-700" />;
        },

        // 处理table表格
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-zinc-700 px-4 py-3 bg-zinc-800 text-zinc-200 font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border px-4 py-3 border-zinc-700 text-zinc-300">
              {children}
            </td>
          );
        },

        // <code> 遇到标签以下写法
        code(props) {
          const { children, className } = props;
          // 只有language-  才提取
          const language = className?.startsWith("language-")
            ? className.replace("language-", "")
            : undefined;

          // 代码块
          if (language) {
            return <CodeBlock language={language}>{children}</CodeBlock>;
          }

          // 行内代码
          return <code>{children}</code>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
