"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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

interface AddressFormProps {
  userId?: string
  address?: Address
  onAddressAdded?: (address: Address) => void
  onAddressUpdated?: (address: Address) => void
  onCancel?: () => void
  isEdit?: boolean
}

export function AddressForm({
  userId,
  address,
  onAddressAdded,
  onAddressUpdated,
  onCancel,
  isEdit = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    address_line1: address?.address_line1 || "",
    address_line2: address?.address_line2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postal_code: address?.postal_code || "",
    is_default: address?.is_default || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_default: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast.error("User ID is required")
      return
    }

    // Validate form
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.state ||
      !formData.postal_code
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEdit && address) {
        // Update existing address
        const { data, error } = await supabase
          .from("user_addresses")
          .update({
            name: formData.name,
            phone: formData.phone,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 || null,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            is_default: formData.is_default,
          })
          .eq("id", address.id)
          .select("*")
          .single()

        if (error) throw error

        if (formData.is_default) {
          // If this address is set as default, update other addresses
          await supabase
            .from("user_addresses")
            .update({ is_default: false })
            .eq("user_id", userId)
            .neq("id", address.id)
        }

        onAddressUpdated?.(data)
      } else {
        // Create new address
        const { data, error } = await supabase
          .from("user_addresses")
          .insert({
            user_id: userId,
            name: formData.name,
            phone: formData.phone,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 || null,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            is_default: formData.is_default,
          })
          .select("*")
          .single()

        if (error) throw error

        if (formData.is_default) {
          // If this address is set as default, update other addresses
          await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId).neq("id", data.id)
        }

        onAddressAdded?.(data)
      }
    } catch (error: any) {
      console.error("Error saving address:", error)
      toast.error("Failed to save address", {
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="1234567890"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address_line1">Address Line 1 *</Label>
        <Input
          id="address_line1"
          name="address_line1"
          value={formData.address_line1}
          onChange={handleChange}
          placeholder="Street address, P.O. box, company name"
          required
        />
      </div>

      <div>
        <Label htmlFor="address_line2">Address Line 2</Label>
        <Input
          id="address_line2"
          name="address_line2"
          value={formData.address_line2}
          onChange={handleChange}
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
        </div>
        <div>
          <Label htmlFor="state">State *</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
        </div>
        <div>
          <Label htmlFor="postal_code">Postal Code *</Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="Postal Code"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="is_default" checked={formData.is_default} onCheckedChange={handleCheckboxChange} />
        <Label htmlFor="is_default" className="text-sm font-normal">
          Set as default address
        </Label>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Update Address"
          ) : (
            "Save Address"
          )}
        </Button>
      </div>
    </form>
  )
}
