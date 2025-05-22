import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  title: string
  description: string
  image: string
  href: string
  color: "teal" | "orange" | "purple"
  icon: React.ReactNode
}

export default function CategoryCard({ title, description, image, href, color, icon }: CategoryCardProps) {
  const colorClasses = {
    teal: "from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700",
    orange: "from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700",
    purple: "from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700",
  }

  return (
    <Link href={href} className="block h-full">
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-xl bg-gradient-to-br text-white transition-all duration-300 hover:shadow-lg",
          colorClasses[color],
        )}
      >
        <div className="absolute inset-0 opacity-20">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <div className="relative z-10 p-6 flex flex-col h-full">
          <div className="mb-4 bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">{icon}</div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-white/80 mb-4">{description}</p>
          <div className="mt-auto flex items-center text-sm font-medium">
            <span>Explore Products</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
