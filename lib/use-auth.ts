"use client"

import { useEffect } from "react"
import { useUserStore } from "@/lib/user-store"
import { useCartStore } from "@/lib/cart-store"
import { supabase } from "@/lib/supabase"

export const useAuth = () => {
  const { user, setUser } = useUserStore()
  const { syncCart } = useCartStore()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)

      if (data.session?.user) {
        syncCart(data.session.user.id)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        syncCart(session.user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, syncCart])

  return { user }
}
