import '../../App.css';
import { Activity } from 'lucide-react'
import Chat from './Chat'
import { useConversations } from '../../db/useChatDB';
import { useChatStore } from '../../store/chatStore'


export default function ChatList() {

  const conversations = useConversations()

  const conversationId =
    useChatStore(
      state => state.conversationId
    )
  const setConversationId =
    useChatStore(
      state => state.setConversationId
    )

  return (
    <>
      <div className='bg-chat-bg-secondary h-full overflow-y-auto min-h-0 flex-6/20'>
        <div className="flex m-4">
          <Activity className='w-4 h-4 text-[#b0b0b6] mr-4' />
          <span className='text-[#b0b0b6] leading-none'>善医者无煌煌之名</span>
        </div>
        <div className='flex flex-col'>
          {
            conversations.map((chat) => (
              <Chat
                key={chat.id}
                name={chat.name}
                isSelected={conversationId === chat.id}
                updatedAt={chat.updatedAt}
                onClick={() => {
                  if (conversationId === chat.id) {
                    setConversationId(null);
                  } else {
                    setConversationId(chat.id ?? null);
                  }
                }}
              ></Chat>
            ))
          }
        </div>
      </div>
    </>
  )
}