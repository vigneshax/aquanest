"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/user-store"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { NotificationsList } from "@/components/notifications-list"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function NotificationsPage() {
  const { user } = useUserStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [user, router])

  const clearAllNotifications = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("notifications").delete().eq("user_id", user.id)

      if (error) throw error

      toast.success("All notifications cleared")
      router.refresh()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error clearing notifications:", error)
      toast.error("Failed to clear notifications", {
        description: error.message,
      })
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
      <div className="flex items-center mb-6">
        <Link href="/profile" className="mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Your Notifications</h1>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Notifications</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to clear all notifications? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllNotifications} className="bg-red-500 hover:bg-red-600">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Stay updated with your orders and account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsList userId={user?.id} limit={50} showAll={false} />
        </CardContent>
      </Card>
    </div>
  )
}
