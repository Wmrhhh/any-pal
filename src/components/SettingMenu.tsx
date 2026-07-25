import { Link } from 'react-router-dom';

export default function SettingMenu() {
  return (
    <aside className="flex w-65 shrink-0 flex-col border-r border-[#39393a] bg-chat-bg-secondary/80 px-4 py-5">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-[0.24em] text-chat-muted">preferences</p>
        <h2 className="mt-2 text-2xl font-semibold text-chat-text">设置</h2>
      </div>

      <div className="space-y-2 rounded-2xl bg-[#1f1f20] p-3 shadow-lg shadow-black/10">
        <Link to="/settings/theme" className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-[#2a2a2b]">
          <span className="text-sm text-chat-text">主题</span>
        </Link>
        <Link to="/settings/account" className="flex items-center rounded-xl px-3 py-2 text-sm text-chat-text hover:bg-[#2a2a2b]">
          账号
        </Link>
        <Link to="/settings/model" className="flex items-center rounded-xl px-3 py-2 text-sm text-chat-text hover:bg-[#2a2a2b]">
          模型
        </Link>
      </div>
    </aside>
  );
}
