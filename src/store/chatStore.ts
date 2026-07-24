import create from 'zustand'

interface ConversationState {
  conversationId: null | number
  setConversationId: (id: number| null)=>void
}

interface ThemeStore{
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

// create<ConversationState>: 创建一个符合 ConversationState 类型的 store
export const useChatStore = create<ConversationState>((set) => ({
  conversationId: null,
  setConversationId(id){
    set({
      conversationId:id
    })
  }
}))

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "dark",
  setTheme(theme) {
    set({
      theme,
    })
  },
}))