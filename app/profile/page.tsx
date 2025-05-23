"use client"

import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, Mail, MapPin, Phone, Edit, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { AddressForm } from "@/components/address-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { NotificationsList } from "@/components/notifications-list"
import { useUserStore } from "@/lib/user-store"

interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  address: string | null
}

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

export default function ProfilePage() {
  const { user, signOut } = useUserStore()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProfileData = async () => {
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

      // Fetch addresses
      const { data: addressesData } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })

      if (addressesData) {
        setAddresses(addressesData)
      }

      setIsLoading(false)
    }

    fetchProfileData()
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

  const handleAddressAdded = (newAddress: Address) => {
    setAddresses((prev) => [...prev, newAddress])
    setIsAddingAddress(false)
    toast.success("Address added successfully")
  }

  const handleAddressUpdated = (updatedAddress: Address) => {
    setAddresses((prev) => prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr)))
    setEditingAddress(null)
    toast.success("Address updated successfully")
  }

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", addressId)

      if (error) throw error

      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
      toast.success("Address deleted successfully")
    } catch (error: any) {
      console.error("Error deleting address:", error)
      toast.error("Failed to delete address", {
        description: error.message,
      })
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
      <h1 className="text-3xl font-bold mb-8">Your Account</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
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
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/orders">View Orders</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/change-password">Change Password</Link>
                  </Button>

                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Addresses</h2>
            <Button onClick={() => setIsAddingAddress(true)} className="flex items-center" disabled={isAddingAddress}>
              <Plus className="mr-1 h-4 w-4" />
              Add New Address
            </Button>
          </div>

          {isAddingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm
                  userId={user?.id}
                  onAddressAdded={handleAddressAdded}
                  onCancel={() => setIsAddingAddress(false)}
                />
              </CardContent>
            </Card>
          )}

          {editingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Address</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm
                  userId={user?.id}
                  address={editingAddress}
                  onAddressUpdated={handleAddressUpdated}
                  onCancel={() => setEditingAddress(null)}
                  isEdit
                />
              </CardContent>
            </Card>
          )}

          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className={address.is_default ? "border-primary-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{address.name}</CardTitle>
                      {address.is_default && (
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600">
                      {address.address_line1}
                      {address.address_line2 && <>, {address.address_line2}</>}
                      <br />
                      {address.city}, {address.state} {address.postal_code}
                      <br />
                      Phone: {address.phone}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAddress(address)}
                      className="flex items-center"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAddress(address.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                <Button onClick={() => setIsAddingAddress(true)}>Add Your First Address</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>Stay updated with your orders and account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationsList userId={user?.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
