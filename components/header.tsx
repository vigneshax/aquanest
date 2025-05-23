"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, User, Fish, Bird, Dog, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useUserStore } from "@/lib/user-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getUnreadNotificationsCount } from "@/lib/notifications"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const pathname = usePathname()
  const { getTotalItems } = useCartStore()
  const { user, signOut } = useUserStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Fetch notifications count
  useEffect(() => {
    if (user) {
      const fetchNotificationsCount = async () => {
        const { count } = await getUnreadNotificationsCount(user.id)
        setNotificationsCount(count)
      }

      fetchNotificationsCount()

      // Set up interval to check for new notifications
      const interval = setInterval(fetchNotificationsCount, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled ? "py-2" : "py-3"}`}>
      <div className="container mx-auto px-4">
      <div
        className={`rounded-full transition-all duration-500 ${
          isScrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-700">AquaNest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/products/fish"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary-500 transition-colors"
            >
              <Fish className="h-4 w-4" />
              <span>Fish & Aquatics</span>
            </Link>
            <Link
              href="/products/birds"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary-500 transition-colors"
            >
              <Bird className="h-4 w-4" />
              <span>Birds</span>
            </Link>
            <Link
              href="/products/dogs"
              className="flex items-center space-x-1 text-sm font-medium hover:text-primary-500 transition-colors"
            >
              <Dog className="h-4 w-4" />
              <span>Dogs</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/notifications" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary-500">
                      {notificationsCount > 9 ? "9+" : notificationsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary-500">
                    {getTotalItems() > 9 ? "9+" : getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/products/fish"
              className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-gray-50 hover:text-primary-500"
            >
              <Fish className="h-5 w-5" />
              <span>Fish & Aquatics</span>
            </Link>
            <Link
              href="/products/birds"
              className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-gray-50 hover:text-primary-500"
            >
              <Bird className="h-5 w-5" />
              <span>Birds</span>
            </Link>
            <Link
              href="/products/dogs"
              className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-gray-50 hover:text-primary-500"
            >
              <Dog className="h-5 w-5" />
              <span>Dogs</span>
            </Link>
          </div>
        </div>
      )}
      </div>
    </header>
  )
}
