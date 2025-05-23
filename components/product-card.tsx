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

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white transition-all duration-300 hover:shadow-md h-full flex flex-col">
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.tag && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.tag}
            </div>
          )}
        </div>

        {/* Decorative overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-12 text-primary-50">
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="p-3 sm:p-4 relative flex-1 flex flex-col">
          <div className="flex items-center mb-1 sm:mb-2">
            {product.rating && (
              <div className="flex items-center">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-xs sm:text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
            <span className="ml-auto text-xs sm:text-sm text-gray-500">{product.category}</span>
          </div>
          <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2 flex-1">{product.description}</p>
          <div className="mt-2 sm:mt-3 flex items-center justify-between">
            <p className="text-sm sm:text-base font-medium text-gray-900">₹{product.price.toFixed(2)}</p>
            <Button
              size="sm"
              className={cn(
                "text-white bg-primary-500 hover:bg-primary-600 text-xs px-2 py-1 h-8",
                isAdding ? "opacity-80" : "",
              )}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              {isAdding ? "Added" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
