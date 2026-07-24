import Setting from '../component/tool/Settings'
import ToolsList from '../component/tool/ToolsList'

export default function SettingPage() {

  return (
    <div className='flex w-full min-h-screen'>
      <ToolsList></ToolsList>
      <Setting></Setting>
    </div>
  )
}