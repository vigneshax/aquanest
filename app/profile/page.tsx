"use client"

import Link from "next/link"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/user-store"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  address: string | null
}

export default function ProfilePage() {
  const { user, signOut } = useUserStore()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      setIsLoading(true)

      // Get user email from auth
      const { data: userData } = await supabase.auth.getUser()

      // Check if profile exists in profiles table
      const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!error && profileData) {
        setProfile({
          id: user.id,
          name: profileData.name,
          email: userData.user?.email || "",
          phone: profileData.phone,
          address: profileData.address,
        })
      } else {
        // Create a default profile if none exists
        setProfile({
          id: user.id,
          name: null,
          email: userData.user?.email || "",
          phone: null,
          address: null,
        })
      }

      setIsLoading(false)
    }

    fetchProfile()
  }, [user, router])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profile) return

    setIsSaving(true)

    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      updated_at: new Date().toISOString(),
    })

    setIsSaving(false)

    if (error) {
      toast.error("Failed to update profile", {
        description: error.message,
      })
    } else {
      toast.success("Profile updated successfully")
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
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
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile?.name || ""}
                    onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Address
                  </Label>
                  <Input id="email" value={profile?.email || ""} disabled className="mt-1 bg-gray-50" />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={profile?.phone || ""}
                    onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Address
                  </Label>
                  <Input
                    id="address"
                    value={profile?.address || ""}
                    onChange={(e) => setProfile((prev) => (prev ? { ...prev, address: e.target.value } : null))}
                    placeholder="Enter your address"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Account Actions</h2>

            <div className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/orders">View Orders</Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/change-password">Change Password</Link>
              </Button>

              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
