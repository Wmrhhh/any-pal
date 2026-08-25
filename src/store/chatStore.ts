import create from 'zustand'

interface ConversationState {
  conversationId: null | number
  setConversationId: (id: number | null) => void

  currentModels: Record<number, string>
  setCurrentModels: (conversationId: number, model: string) => void
}
type theme = "light" | "dark"
interface ThemeStore {
  theme: theme
  setTheme: (theme: theme) => void
}

// create<ConversationState>: 创建一个符合 ConversationState 类型的 store
export const useChatStore = create<ConversationState>((set) => ({
  conversationId: null,
  setConversationId(id) {
    set({
      conversationId: id,
    })
  },
  currentModels: {},
  setCurrentModels(conversationId, model) {
    set((state) => ({
      currentModels: {
        // 不覆盖原先数据，计算属性名
        ...state.currentModels,
        [conversationId]: model,
      },
    }))
  },
}))

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "dark",
  setTheme(theme) {
    set({
      theme: theme
    })
  },
}))