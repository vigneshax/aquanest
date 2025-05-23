"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { useUserStore } from "@/lib/user-store"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Plus, CreditCard, Truck, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { AddressForm } from "@/components/address-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createNotification } from "@/lib/notifications"

interface Address {
  id: number
  user_id: string
  name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useUserStore()
  const router = useRouter()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  // const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState("")

  // Calculate totals
  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (items.length === 0) {
      router.push("/cart")
      return
    }

    const fetchAddresses = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })

      if (!error && data) {
        setAddresses(data)
        // Set default address if available
        const defaultAddress = data.find((addr) => addr.is_default)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id)
        }
      }
      setIsLoading(false)
    }

    fetchAddresses()
  }, [user, router, items.length])

  const handleAddressAdded = (newAddress: Address) => {
    setAddresses((prev) => [...prev, newAddress])
    setSelectedAddressId(newAddress.id)
    setIsAddingAddress(false)
    toast.success("Address added successfully")
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order")
      return
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address")
      return
    }

    setIsProcessing(true)

    try {
      const generateOrderId = () => {
        return `ORD-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`
      }
      // Create order in the database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          id: generateOrderId(),
          user_id: user.id,
          address_id: selectedAddressId,
          total: total,
          status: "processing",
          notes: notes || null,
        })
        .select("id")
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Add order timeline entry
      const { error: timelineError } = await supabase.from("order_timeline").insert({
        order_id: orderData.id,
        status: "placed",
        message: "Your order has been placed successfully and is awaiting processing.",
      })

      if (timelineError) throw timelineError

      // Create notification for the user
      await createNotification({
        user_id: user.id,
        title: "Order Placed Successfully",
        message: `Your order #${orderData.id} has been placed and is being processed.`,
        type: "order",
      })

      // Clear cart after successful order
      await clearCart()

      toast.success("Order placed successfully!", {
        description: "You will receive a confirmation shortly.",
      })

      // Redirect to order confirmation page
      router.push(`/orders/${orderData.id}`)
    } catch (error: any) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Delivery Address Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Delivery Address
              </CardTitle>
              <CardDescription>Select where you want your order delivered</CardDescription>
            </CardHeader>
            <CardContent>
              {isAddingAddress ? (
                <AddressForm
                  userId={user?.id}
                  onAddressAdded={handleAddressAdded}
                  onCancel={() => setIsAddingAddress(false)}
                />
              ) : addresses.length > 0 ? (
                <RadioGroup
                  value={selectedAddressId?.toString()}
                  onValueChange={(value) => setSelectedAddressId(Number(value))}
                >
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor={`address-${address.id}`} className="font-medium">
                            {address.name}{" "}
                            {address.is_default && <span className="text-xs text-primary-500">(Default)</span>}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                            <br />
                            {address.city}, {address.state} {address.postal_code}
                            <br />
                            Phone: {address.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-gray-500">You don't have any saved addresses.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="flex items-center"
              >
                {isAddingAddress ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Add New Address
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Payment Method Section */}
          {/* <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>Select how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="cod" id="payment-cod" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="payment-cod" className="font-medium">
                        Cash on Delivery
                      </Label>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="online" id="payment-online" disabled />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="payment-online" className="font-medium text-gray-400">
                        Online Payment (Coming Soon)
                      </Label>
                      <p className="text-sm text-gray-500">Pay now with credit/debit card or UPI</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card> */}

          {/* Order Notes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>Add any special instructions for your order (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Special instructions for delivery, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>{items.length} item(s) in your cart</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span>
                      {item.name} <span className="text-gray-500">× {item.quantity}</span>
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddressId}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By placing your order, you agree to our{" "}
                <Link href="/terms" className="text-primary-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary-500 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
