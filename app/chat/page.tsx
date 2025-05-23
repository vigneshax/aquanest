"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/lib/use-products"
import Image from "next/image"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  products?: Array<{
    id: number
    name: string
    image: string | null
    price: number
  }>
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm AquaBot, your shopping assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: products } = useProducts()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate bot typing
    setIsTyping(true)

    // More advanced responses with product recommendations
    setTimeout(() => {
      setIsTyping(false)

      let botResponse =
        "I'm not sure how to help with that. Could you try asking something about our products or categories?"
      let recommendedProducts: Message["products"] = undefined

      const lowerCaseMessage = message.toLowerCase()

      if (lowerCaseMessage.includes("recommend") || lowerCaseMessage.includes("suggest")) {
        if (lowerCaseMessage.includes("fish") || lowerCaseMessage.includes("aquarium")) {
          botResponse = "Here are some of our top fish products that customers love:"
          recommendedProducts = products
            ?.filter((p) => p.category === "fish")
            .slice(0, 3)
            .map((p) => ({
              id: p.id,
              name: p.name,
              image: p.image,
              price: p.price,
            }))
        } else if (lowerCaseMessage.includes("bird")) {
          botResponse = "These bird products are very popular with our customers:"
          recommendedProducts = products
            ?.filter((p) => p.category === "birds")
            .slice(0, 3)
            .map((p) => ({
              id: p.id,
              name: p.name,
              image: p.image,
              price: p.price,
            }))
        } else if (lowerCaseMessage.includes("dog")) {
          botResponse = "Here are some great products for your dog:"
          recommendedProducts = products
            ?.filter((p) => p.category === "dogs")
            .slice(0, 3)
            .map((p) => ({
              id: p.id,
              name: p.name,
              image: p.image,
              price: p.price,
            }))
        } else {
          botResponse = "I'd be happy to recommend some products. What type of pet do you have? Fish, birds, or dogs?"
        }
      } else if (lowerCaseMessage.includes("fish") || lowerCaseMessage.includes("aquarium")) {
        botResponse =
          "We have a great selection of fish and aquarium supplies! Would you like to see our tropical fish, goldfish, or aquarium equipment?"
      } else if (lowerCaseMessage.includes("bird") || lowerCaseMessage.includes("parrot")) {
        botResponse =
          "Our bird section has everything from food to toys and cages. Are you looking for something specific for your feathered friend?"
      } else if (lowerCaseMessage.includes("dog") || lowerCaseMessage.includes("puppy")) {
        botResponse = "We have premium dog food, toys, and accessories. What does your canine companion need today?"
      } else if (lowerCaseMessage.includes("price") || lowerCaseMessage.includes("cost")) {
        botResponse =
          "Our prices are competitive and we offer free shipping on orders over ₹500. Is there a specific product you'd like to know the price of?"
      } else if (lowerCaseMessage.includes("shipping") || lowerCaseMessage.includes("delivery")) {
        botResponse =
          "We offer fast shipping across India. Orders are typically delivered within 3-5 business days, and shipping is free for orders over ₹500!"
      } else if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
        botResponse = "Hello there! How can I help you with your pet needs today?"
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
        products: recommendedProducts,
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Chat header */}
        <div className="bg-primary-600 text-white p-4 flex items-center">
          <Link href="/" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center">
            <Bot className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">Chat with AquaBot</h1>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-[calc(100vh-250px)] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.sender === "user" ? "bg-primary-500 text-white" : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                <div className="flex items-start mb-1">
                  {msg.sender === "bot" && <Bot className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p>{msg.content}</p>

                    {/* Product recommendations */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {msg.products.map((product) => (
                          <Link
                            href={`/product/${product.id}`}
                            key={product.id}
                            className="block bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition-colors"
                          >
                            <div className="aspect-square relative mb-2 rounded overflow-hidden">
                              <Image
                                src={product.image || "/placeholder.svg?height=100&width=100"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                            <p className="text-sm text-primary-600 font-bold">₹{product.price.toFixed(2)}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs opacity-70 text-right mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="border-t p-4 flex">
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="ml-2">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
