import { Link } from 'react-router-dom';
// import { useState } from 'react'

export default function SettingMenu() {
  // const [isSelect, setIsSelect] = useState(false)

  return (
    <aside className="flex w-80 shrink-0 flex-col bg-[#eeeef0] dark:bg-[#2f2f30] px-4 py-5">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-[0.24em] text-chat-muted">preferences</p>
        <h2 className="mt-2 text-2xl font-semibold dark:text-[#e1e1e5] text-[#1a1a1a]">设置</h2>
      </div>

      <Link
        to="/settings/theme"
        className={`flex items-center justify-between rounded-xl px-3 py-2 dark:hover:bg-[#2a2a2b] hover:bg-[#e2e2e4]`}
      // onClick={() => setIsSelect(!isSelect)}  ${isSelect ? 'bg-[#19ac71]' : ''}
      >
        <span
          className={`text-sm dark:text-[#e1e1e5] text-[#1a1a1a]`}

        >
          主题
        </span>
      </Link>
      <Link to="/settings/account" className="flex items-center rounded-xl px-3 py-2 text-sm dark:text-[#e1e1e5] text-[#1a1a1a] dark:hover:bg-[#2a2a2b] hover:bg-[#e2e2e4]">
        <span className="text-sm dark:text-[#e1e1e5] text-[#1a1a1a]">账户</span>
      </Link>
      <Link to="/settings/model" className="flex items-center rounded-xl px-3 py-2 text-sm dark:text-[#e1e1e5] text-[#1a1a1a] dark:hover:bg-[#2a2a2b] hover:bg-[#e2e2e4]">
        <span className="text-sm dark:text-[#e1e1e5] text-[#1a1a1a]">模型</span>
      </Link>
    </aside>
  );
}
