import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export type Product = {
  id: number
  name: string
  price: number
  tag: string | null
  category: string | null
  description: string | null
  rating: number | null
  image: string | null
}

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*")

      if (category && category !== "") {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data as Product[]
    },
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

      if (error) {
        throw new Error(error.message)
      }

      return data as Product
    },
    enabled: !!id,
  })
}

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const { data, error } = await supabase.from("products").insert(product).select().single()

      if (error) {
        throw new Error(error.message)
      }

      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
