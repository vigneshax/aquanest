import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/components/providers"
import { SonnerProvider } from "@/components/sonner-provider"
import ChatWidget from "@/components/chat-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AquaNest - Your One-Stop Pet Shop",
  description: "Find the best products for your fish, birds, and dogs at AquaNest.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ChatWidget />
            </div>
            <SonnerProvider />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
