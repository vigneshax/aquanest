"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { useAuth } from "@/lib/use-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  // Initialize auth
  useAuth()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
