import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type UserStore = {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => {
        set({ user })
      },

      signOut: async () => {
        set({ isLoading: true })
        await supabase.auth.signOut()
        set({ user: null, isLoading: false })
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
