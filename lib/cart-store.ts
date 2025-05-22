import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"

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
        const { user } = await supabase.auth.getUser()
        const userId = user?.data?.user?.id

        // Check if item already exists in cart
        const existingItem = get().items.find((i) => i.product_id === item.product_id)

        if (existingItem) {
          // Update quantity instead of adding new item
          await get().updateQuantity(item.product_id, existingItem.quantity + item.quantity)
          set({ isLoading: false })
          return
        }

        if (userId) {
          // Add to database if user is logged in
          const { data, error } = await supabase
            .from("cart_items")
            .insert({
              user_id: userId,
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })
            .select("*")
            .single()

          if (error) {
            console.error("Error adding item to cart:", error)
            set({ isLoading: false })
            return
          }

          set((state) => ({
            items: [...state.items, data as CartItem],
            isLoading: false,
          }))
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
        const { user } = await supabase.auth.getUser()
        const userId = user?.data?.user?.id

        if (userId) {
          // Remove from database if user is logged in
          const { error } = await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", productId)

          if (error) {
            console.error("Error removing item from cart:", error)
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
        const { user } = await supabase.auth.getUser()
        const userId = user?.data?.user?.id

        if (quantity <= 0) {
          await get().removeItem(productId)
          return
        }

        if (userId) {
          // Update in database if user is logged in
          const { error } = await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", userId)
            .eq("product_id", productId)

          if (error) {
            console.error("Error updating cart item quantity:", error)
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
        const { user } = await supabase.auth.getUser()
        const userId = user?.data?.user?.id

        if (userId) {
          // Clear from database if user is logged in
          const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

          if (error) {
            console.error("Error clearing cart:", error)
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

        // Get cart items from database
        const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId)

        if (error) {
          console.error("Error fetching cart items:", error)
          set({ isLoading: false })
          return
        }

        // Update local state with items from database
        set({ items: data as CartItem[], isLoading: false })
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
