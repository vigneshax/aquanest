import { supabase } from "@/lib/supabase"

interface NotificationData {
  user_id: string
  title: string
  message: string
  type: "order" | "info" | "alert"
}

export async function createNotification(data: NotificationData) {
  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      is_read: false,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error creating notification:", error)
    return { success: false, error }
  }
}

export async function getUnreadNotificationsCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) throw error

    return { count: count || 0 }
  } catch (error) {
    console.error("Error getting unread notifications count:", error)
    return { count: 0, error }
  }
}
