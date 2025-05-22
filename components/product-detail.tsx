"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/use-products"
import { useCartStore } from "@/lib/cart-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  const handleAddToCart = async () => {
    await addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image || "/placeholder.svg?height=300&width=300",
    })

    toast.success("Added to cart", {
      description: `${quantity} × ${product.name} added to your cart`,
    })
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary-500 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.tag && (
            <div className="absolute top-4 right-4 bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {product.tag}
            </div>
          )}
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              {product.rating && (
                <div className="flex items-center mr-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                </div>
              )}
              <span className="text-sm text-gray-500">Category: {product.category}</span>
            </div>
            <p className="text-2xl font-bold text-primary-600 mb-4">₹{product.price.toFixed(2)}</p>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 rounded-none">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-gray-700">{product.description || "No description available for this product."}</p>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Premium quality product</li>
                <li>Suitable for all pet types</li>
                <li>Made with high-quality materials</li>
                <li>Easy to use and maintain</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <p className="text-gray-700">
                We offer fast and reliable shipping across India. Orders are typically processed within 24 hours and
                delivered within 3-5 business days. Free shipping on orders above ₹500.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
