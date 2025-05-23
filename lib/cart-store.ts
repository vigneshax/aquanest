/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useUserStore } from "./user-store"

export type CartItem = {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  image: string
}

type CartStore = {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: Omit<CartItem, "id">) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: (userId: string | undefined) => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (item) => {
        set({ isLoading: true })
        const user = useUserStore.getState().user
        if (!user) return

        // Check if item already exists in cart
        const existingItem = get().items.find((i) => i.product_id === item.product_id)

        if (existingItem) {
          // Update quantity instead of adding new item
          await get().updateQuantity(item.product_id, existingItem.quantity + item.quantity)
          set({ isLoading: false })
          return
        }

        if (user.id) {
          try {
            // Add to database if user is logged in
            const { data, error } = await supabase
              .from("cart_items")
              .insert({
                user_id: user.id,
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
              })
              .select("*")
              .single()

            if (error) {
              throw error
            }

            set((state) => ({
              items: [...state.items, data as CartItem],
              isLoading: false,
            }))
          } catch (error: any) {
            console.error("Error adding item to cart:", error)
            toast.error("Failed to add item to cart", {
              description: error.message,
            })
            set({ isLoading: false })
          }
        } else {
          // Add to local state only if user is not logged in
          set((state) => ({
            items: [...state.items, { ...item, id: Date.now() }],
            isLoading: false,
          }))
        }
      },

      removeItem: async (productId) => {
        set({ isLoading: true })
        const user = useUserStore.getState().user

        if (user?.id) {
          try {
            // Remove from database if user is logged in
            const { error } = await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", productId)

            if (error) {
              throw error
            }
          } catch (error: any) {
            console.error("Error removing item from cart:", error)
            toast.error("Failed to remove item from cart", {
              description: error.message,
            })
            set({ isLoading: false })
            return
          }
        }

        // Remove from local state
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
          isLoading: false,
        }))
      },

      updateQuantity: async (productId, quantity) => {
        set({ isLoading: true })
        const user = useUserStore.getState().user

        if (quantity <= 0) {
          await get().removeItem(productId)
          return
        }

        if (user?.id) {
          try {
            // Update in database if user is logged in
            const { error } = await supabase
              .from("cart_items")
              .update({ quantity })
              .eq("user_id", user.id)
              .eq("product_id", productId)

            if (error) {
              throw error
            }
          } catch (error: any) {
            console.error("Error updating cart item quantity:", error)
            toast.error("Failed to update quantity", {
              description: error.message,
            })
            set({ isLoading: false })
            return
          }
        }

        // Update in local state
        set((state) => ({
          items: state.items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
          isLoading: false,
        }))
      },

      clearCart: async () => {
        set({ isLoading: true })
        const user = useUserStore.getState().user

        if (user?.id) {
          try {
            // Clear from database if user is logged in
            const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

            if (error) {
              throw error
            }
          } catch (error: any) {
            console.error("Error clearing cart:", error)
            toast.error("Failed to clear cart", {
              description: error.message,
            })
            set({ isLoading: false })
            return
          }
        }

        // Clear local state
        set({ items: [], isLoading: false })
      },

      syncCart: async (userId) => {
        if (!userId) return

        set({ isLoading: true })

        try {
          // Get cart items from database
          const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId)

          if (error) {
            throw error
          }

          // Update local state with items from database
          set({ items: data as CartItem[], isLoading: false })
        } catch (error: any) {
          console.error("Error fetching cart items:", error)
          toast.error("Failed to sync cart", {
            description: error.message,
          })
          set({ isLoading: false })
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
