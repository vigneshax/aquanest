"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/user-store"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Package, ArrowLeft, Truck, MapPin, Calendar, CreditCard, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { OrderTimeline } from "@/components/order-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  name: string
  price: number
  quantity: number
  image: string | null
}

interface Order {
  id: string
  user_id: string
  address_id: number
  total: number
  status: string
  payment_method: string
  notes: string | null
  created_at: string
  address: {
    name: string
    phone: string
    address_line1: string
    address_line2: string | null
    city: string
    state: string
    postal_code: string
  } | null
  items: OrderItem[]
}

type Params = {
  id: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default function OrderDetailsPage({ params }: PageProps) {
  const orderId = use(params).id;
  const { user } = useUserStore()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchOrderDetails = async () => {
      setIsLoading(true)

      try {
        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single()

        if (orderError) throw orderError

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId)

        if (itemsError) throw itemsError

        // Fetch address
        const { data: addressData, error: addressError } = await supabase
          .from("user_addresses")
          .select("name, phone, address_line1, address_line2, city, state, postal_code")
          .eq("id", orderData.address_id)
          .single()

        if (addressError && addressError.code !== "PGRST116") {
          // PGRST116 is "Row not found" error, which is fine if address was deleted
          throw addressError
        }

        setOrder({
          ...orderData,
          items: itemsData || [],
          address: addressData || null,
        })
      } catch (error) {
        console.error("Error fetching order details:", error)
        router.push("/orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [user, router, orderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "processing":
        return <Clock className="h-5 w-5" />
      case "cancelled":
        return <Package className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500">Order not found</p>
          <Button asChild className="mt-4">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/orders" className="mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <span
          className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.status,
          )}`}
        >
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Items included in your order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">₹{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{order.address.name}</p>
                    <p className="text-gray-600">
                      {order.address.address_line1}
                      {order.address.address_line2 && `, ${order.address.address_line2}`}
                      <br />
                      {order.address.city}, {order.address.state} {order.address.postal_code}
                      <br />
                      Phone: {order.address.phone}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Order Date</span>
                    </div>
                    <span className="text-sm">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">Payment Method</span>
                    </div>
                    <span className="text-sm capitalize">{order.payment_method}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{(order.total / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span>₹{(order.total - order.total / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-1">Order Notes</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link href={`/orders/${order.id}/track`}>
                        <Truck className="mr-2 h-4 w-4" />
                        Track Order
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the progress of your order</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTimeline orderId={order.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}
