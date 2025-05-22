"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fish Enthusiast",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "The quality of aquarium supplies from AquaNest is exceptional. My tropical fish are thriving with their premium food and the water conditioners keep my tank crystal clear.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Bird Owner",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "I've been buying bird food and toys from AquaNest for years. The variety is amazing and my parakeets absolutely love everything I get them from here!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Dog Parent",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "The dog food selection is fantastic and the quality is top-notch. My Golden Retriever has never been healthier since switching to the premium brands they carry.",
    rating: 4,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Aquarium Hobbyist",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "Their selection of exotic fish species is unmatched. The staff is knowledgeable and helped me set up my reef tank with all the right equipment.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what pet lovers have to say about their experience with AquaNest.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-md p-8 relative">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-primary-500 text-white rounded-full p-2">
                      <Star className="h-5 w-5 fill-white" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="flex-shrink-0 mb-4 md:mb-0">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4 mr-1",
                                i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 italic mb-4">{testimonial.content}</p>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {testimonials.map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                onClick={() => setActiveIndex(i)}
                className={cn("rounded-full w-2 h-2 p-0 min-w-0", i === activeIndex ? "bg-primary-500" : "bg-gray-300")}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
