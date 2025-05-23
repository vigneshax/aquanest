"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2, Bell, ShoppingBag, Info, AlertCircle, Check } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: number
  user_id: string
  title: string
  message: string
  type: "order" | "info" | "alert"
  is_read: boolean
  created_at: string
}

interface NotificationsListProps {
  userId?: string
  limit?: number
  showAll?: boolean
}

export function NotificationsList({ userId, limit = 10, showAll = true }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    if (!userId) return

    const fetchNotifications = async () => {
      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(limit)

        if (error) throw error

        setNotifications(data || [])

        // Check if there are more notifications
        const { count } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        setHasMore(count ? count > limit : false)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [userId, limit])

  const markAsRead = async (notificationId: number) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))

      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark notifications as read")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-primary-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">You don't have any notifications yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Recent Notifications</h3>
        {notifications.some((n) => !n.is_read) && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.is_read ? "bg-white" : "bg-primary-50 border-primary-100"
            }`}
            onClick={() => !notification.is_read && markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{notification.title}</h4>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}
                      className="h-6 w-6 p-0 rounded-full"
                    >
                      <Check className="h-3 w-3" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && showAll && (
        <div className="text-center mt-4">
          <Button variant="outline" asChild>
            <Link href="/notifications">View All Notifications</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
