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
        <div className="aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.tag && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.tag}
            </div>
          )}
        </div>

        {/* Decorative overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              fill={variant === "teal" ? "#5eead4" : variant === "orange" ? "#fdba74" : "#c4b5fd"}
              d="M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,154.7C672,181,768,203,864,197.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="p-4 relative">
          <div className="flex items-center mb-2">
            {product.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
            <span className="ml-auto text-sm text-gray-500">{product.category}</span>
          </div>
          <h3 className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2 hidden md:block">
            {product.description}
          </p>
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
    </Link>
  )
}
