"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/use-products"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  variant?: "teal" | "orange" | "purple"
}

export default function ProductCard({ product, variant = "teal" }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    await addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || "/placeholder.svg?height=200&width=200",
    })

    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    })

    setTimeout(() => setIsAdding(false), 500)
  }

  const variantClasses = {
    teal: "bg-gradient-to-b from-white via-white to-teal-50",
    orange: "bg-gradient-to-b from-white via-white to-orange-50",
    purple: "bg-gradient-to-b from-white via-white to-purple-50",
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl",
          variantClasses[variant]
        )}
      >
        {/* Decorative Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[url('/wave.svg')] bg-cover bg-no-repeat bg-bottom pointer-events-none z-0" />

        {/* Tag on Top Right */}
        {product.tag && (
          <div className="absolute top-3 right-3 z-10 rounded px-3 py-1 text-xs font-semibold text-white bg-black shadow">
            {product.tag}
          </div>
        )}

        <div className="relative z-10">
          <div className="relative h-74 w-full overflow-hidden hover-shimmer">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {/* <div className="absolute bottom-[-1px] left-0 right-0 z-10">
              <svg
                viewBox="0 0 500 50"
                preserveAspectRatio="none"
                className="w-full h-[40px] fill-white scale-y-[-1]"
              >
                <path d="M0,30 C150,80 350,0 500,30 L500,00 L0,0 Z" />
              </svg>
            </div> */}
          </div>


          {/* Product Details Section with wave on top */}
          <div className="relative backdrop-blur-sm bg-white/60 rounded-b-lg z-20">
            {/* Wave SVG at the top of this section */}
            <div className="absolute top-[-1px] left-0 right-0 z-10">
              <svg
                viewBox="0 0 500 50"
                preserveAspectRatio="none"
                className="w-full h-[40px] fill-white scale-y-[-1]"
              >
                <path d="M0,30 C150,80 350,0 500,30 L500,00 L0,0 Z" />
              </svg>
            </div>

            {/* Padding pushes content below the SVG */}
            <div className="pt-10 px-4 pb-4 relative z-20">
              <div className="flex items-center mb-2">
                {product.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{product.rating}</span>
                  </div>
                )}
                <span className="ml-auto text-sm text-gray-500">{product.category}</span>
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-700 line-clamp-2">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-medium text-gray-900">₹{product.price.toFixed(2)}</p>
                <Button
                  size="sm"
                  className={cn("text-white bg-primary-500 hover:bg-primary-600", isAdding ? "opacity-80" : "")}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  {isAdding ? "Added" : "Add"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}
