import { useThemeStore } from "../../store/chatStore"

export default function Theme() {
  const activeTheme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  return (
    <main className='flex-1 overflow-y-auto p-6'>
      <div className='mx-auto max-w-3xl space-y-5'>
        <section className='rounded-3xl border border-[#39393a] bg-[#232324] p-5 shadow-lg shadow-black/15'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.24em] text-chat-muted'>appearance</p>
              <h3 className='mt-1 text-lg font-semibold text-chat-text'>主题设置</h3>
            </div>
            <div className='rounded-full w-20 bg-chat-accent/15 text-center py-2 text-[18px] text-chat-accent'>
              {activeTheme === 'light' ? 'Light' : 'Dark'}
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between rounded-2xl border border-[#39393a] bg-[#2a2a2b] px-4 py-3'>
              <div>
                <div className='text-sm font-medium text-chat-text'>Theme Toggle</div>
              </div>
              <button
                type='button'
                aria-pressed={activeTheme === 'dark'}
                className={`flex h-5 w-10 items-center rounded-full p-0.5 transition-all duration-300 ${activeTheme === 'dark' ? 'bg-chat-accent' : 'bg-chat-bg'}`}
                onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition-transform duration-300 ${activeTheme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}