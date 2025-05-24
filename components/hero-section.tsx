"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Fish, Bird, Dog } from "lucide-react"

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
      color: "from-orange-500 to-orange-600",
      icon: <Bird className="h-8 w-8" />,
      link: "/products/birds",
    },
    {
      title: "Canine Companions",
      subtitle: "Everything your dog needs to thrive",
      description: "Shop premium dog food, toys, accessories, and grooming supplies for your loyal four-legged friend.",
      image: "https://img.freepik.com/free-photo/portrait-adorable-child-with-their-dog-field_23-2151025353.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&w=740",
      color: "from-purple-500 to-purple-600",
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
      <div
        className={`relative min-h-[500px] md:min-h-[600px] bg-gradient-to-r ${currentSlideData.color} transition-colors duration-1000`}
      >
        {/* Background pattern */}
        {/* <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div> */}

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{currentSlideData.title}</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">{currentSlideData.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-100">
                  <Link href={currentSlideData.link}>Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
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
                <Image
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
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

        {/* Wave divider */}
        <div className="hero-wave  transform rotate-180">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
