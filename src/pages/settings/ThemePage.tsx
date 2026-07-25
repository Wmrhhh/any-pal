export default function ThemePage() {
  return (
    <main className="p-6 text-chat-text">
      <h2 className="text-2xl font-semibold">主题设置</h2>
      {/* <p className="mt-2 text-chat-muted">这里可以切换界面主题。</p> */}

      <section className="mt-6 rounded-2xl border border-[#39393a] bg-[#232324] p-5 shadow-lg shadow-black/15">
        <div className="mb-4 flex items-center justify-between">
          <div>
            {/* <p className="text-xs uppercase tracking-[0.24em] text-chat-muted">appearance</p> */}
            <h3 className="mt-1 text-lg font-semibold text-chat-text">亮暗模式</h3>
          </div>
          <div className="rounded-full bg-chat-accent/15 px-3 py-1 text-sm text-chat-accent">
            亮/暗
          </div>
        </div>

        <div className="rounded-2xl border border-[#39393a] bg-[#2a2a2b] p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-chat-text">主题切换</div>
              <div className="mt-1 text-sm text-chat-muted">当前界面风格展示</div>
            </div>
            <button
              type="button"
              className="flex h-5 w-10 items-center rounded-full bg-chat-bg p-0.5"
              aria-label="主题切换"
            >
              <span className="h-4 w-4 rounded-full bg-white transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
