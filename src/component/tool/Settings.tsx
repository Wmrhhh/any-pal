import { useThemeStore } from '../../store/chatStore'
import Theme from './Theme'
import { Link } from 'react-router-dom'

export default function Settings() {
  const activeTheme = useThemeStore((state) => state.theme)


  return (
    <div className='flex h-screen w-full bg-chat-bg text-chat-text'>
      <aside className='flex w-65 shrink-0 flex-col border-r border-[#39393a] bg-chat-bg-secondary/80 px-4 py-5'>
        <div className='mb-6 px-2'>
          <p className='text-xs uppercase tracking-[0.24em] text-chat-muted'>preferences</p>
          <h2 className='mt-2 text-2xl font-semibold text-chat-text'>设置</h2>
        </div>

        <div className='rounded-2xl bg-[#1f1f20] px-4 py-3 shadow-lg shadow-black/10'>
          <Link to="/settings/theme">
            <div className='flex items-center justify-between'>
              <span className='text-sm text-chat-text'>主题</span>
              <span className='rounded-full bg-chat-accent/15 px-2.5 py-1 text-[11px] text-chat-accent'>
                {activeTheme}
              </span>
            </div>
          </Link>
        </div>
      </aside>
      <Theme></Theme>

    </div>
  )
} 