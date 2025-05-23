"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"
import { Loader2, Package, Truck, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface TimelineEvent {
  id: number
  order_id: string
  status: string
  message: string
  timestamp: string
}

interface OrderTimelineProps {
  orderId: string
}

export function OrderTimeline({ orderId }: OrderTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTimeline = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("order_timeline")
          .select("*")
          .eq("order_id", orderId)
          .order("timestamp", { ascending: true })

        if (error) throw error
        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching order timeline:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimeline()
  }, [orderId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <Package className="h-5 w-5 text-primary-500" />
      case "processed":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    )
  }

  if (events.length === 0) {
    return <p className="text-gray-500 text-center py-4">No timeline events available for this order.</p>
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Vertical line connecting events */}
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200" />

        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
            <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
              {getStatusIcon(event.status)}
            </div>
            <div className="ml-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="font-medium capitalize">{event.status.replace(/_/g, " ")}</p>
                <span className="text-sm text-gray-500">
                  {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
