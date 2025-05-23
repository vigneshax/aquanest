"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useUserStore } from "@/lib/user-store"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const { user } = useUserStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRemoveItem = (productId: number) => {
    removeItem(productId)
    toast.success("Item removed", {
      description: "The item has been removed from your cart",
    })
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login", {
        description: "You need to be logged in to checkout",
      })
      return
    }

    setIsProcessing(true)

    // Redirect to checkout page
    window.location.href = "/checkout"
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Cart Items ({items.length})</h2>
            </div>

            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.product_id} className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">Unit Price: ₹{item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 rounded-none"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            className="h-8 w-8 rounded-none"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="text-xs">Remove</span>
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{getTotalPrice() > 500 ? "Free" : "₹50.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ₹{(getTotalPrice() + (getTotalPrice() > 500 ? 0 : 50) + getTotalPrice() * 0.18).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isProcessing}
              asChild={!isProcessing && user ? true : false}
            >
              {isProcessing ? (
                "Processing..."
              ) : user ? (
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {!user && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Please{" "}
                <Link href="/login?redirect=/checkout" className="text-primary-500 hover:underline">
                  login
                </Link>{" "}
                to complete your purchase
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
