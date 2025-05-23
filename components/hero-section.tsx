"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Fish, Bird, Dog, ChevronRight } from "lucide-react"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Aquatic Wonders",
      subtitle: "Discover the perfect companions for your aquarium",
      description:
        "Explore our wide range of fish species, aquatic plants, and essential supplies for a thriving underwater ecosystem.",
      image: "https://img.freepik.com/free-photo/beautiful-exotic-colorful-fish_23-2150737617.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740",
      color: "from-primary-500 to-primary-600",
      icon: <Fish className="h-8 w-8" />,
      link: "/products/fish",
    },
    {
      title: "Feathered Friends",
      subtitle: "Beautiful birds and premium supplies",
      description:
        "Find the perfect avian companion along with cages, toys, and nutritious food to keep your birds happy and healthy.",
      image: "https://img.freepik.com/free-photo/animal-perching-branch-surrounded-by-cherry-blossoms-spring-generated-by-artificial-intelligence_188544-128336.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740",
      color: "from-primary-500 to-primary-600",
      icon: <Bird className="h-8 w-8" />,
      link: "/products/birds",
    },
    {
      title: "Canine Companions",
      subtitle: "Everything your dog needs to thrive",
      description: "Shop premium dog food, toys, accessories, and grooming supplies for your loyal four-legged friend.",
      image: "https://img.freepik.com/free-photo/portrait-adorable-child-with-their-dog-field_23-2151025353.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&w=740",
      color: "from-primary-500 to-primary-600",
      icon: <Dog className="h-8 w-8" />,
      link: "/products/dogs",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative overflow-hidden">
      {/* Next-gen background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-primary-300 opacity-20 blur-3xl animate-float"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary-300 to-blue-400 opacity-20 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/6 w-48 h-48 rounded-full bg-gradient-to-r from-blue-300 to-primary-200 opacity-10 blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Mesh gradient effect */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#0369a1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#meshGradient)" />
            </svg>
          </div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwaDQydjQySDM2VjE4eiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              {currentSlideData.icon}
              <span className="ml-2 text-sm font-medium">{currentSlideData.subtitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              {currentSlideData.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">{currentSlideData.description}</p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary-700 hover:bg-blue-50 hover:text-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link href={currentSlideData.link} className="flex items-center">
                  Shop Now <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            key={`image-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative hidden md:block"
          >
            <div className="relative h-[400px] w-full">
              {/* Decorative elements behind the image */}
              <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-3 backdrop-blur-sm"></div>
              <div className="absolute inset-0 bg-white/10 rounded-2xl transform -rotate-3 backdrop-blur-sm"></div>

              <Image
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.title}
                fill
                className="object-cover rounded-lg shadow-lg z-10 relative"
              />

              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-blue-300 rounded-lg opacity-50 blur-xl group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full animate-float" />
            <div
              className="absolute bottom-12 -left-8 h-24 w-24 bg-white/10 backdrop-blur-sm rounded-full animate-float"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 right-1/3 h-12 w-12 bg-white/15 backdrop-blur-sm rounded-full animate-float"
              style={{ animationDelay: "2s" }}
            />
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Wave divider - fixed to be right-side up */}
    <div className="relative">
  {/* Your hero content here */}

  {/* Upside-down wave at bottom */}
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none rotate-180">
    <svg
      className="w-full h-[100px]"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39
        C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35
        A600.21,600.21,0,0,0,321.39,56.44Z"
        className="fill-[#7dd3fc]"
      />
    </svg>
  </div>
</div>
    </div>

  )
}
