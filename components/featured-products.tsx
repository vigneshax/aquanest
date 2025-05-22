"use client"

import { useProducts } from "@/lib/use-products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface FeaturedProductsProps {
  category: string
  title: string
  description: string
  variant?: "teal" | "orange" | "purple"
  limit?: number
}

export default function FeaturedProducts({
  category,
  title,
  description,
  variant = "teal",
  limit = 4,
}: FeaturedProductsProps) {
  const { data: products, isLoading, error } = useProducts(category)

  const displayProducts = products?.slice(0, limit) || []

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 max-w-2xl">{description}</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="mt-4 md:mt-0">
            <Link href={`/products/${category.toLowerCase()}`} className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-100 animate-pulse h-[300px]"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load products</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
