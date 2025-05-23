"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

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

    // Simple responses based on keywords
    setTimeout(() => {
      setIsTyping(false)

      let botResponse =
        "I'm not sure how to help with that. Could you try asking something about our products or categories?"

      const lowerCaseMessage = message.toLowerCase()

      if (lowerCaseMessage.includes("fish") || lowerCaseMessage.includes("aquarium")) {
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
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 p-0 shadow-lg"
        aria-label="Chat with us"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Chat header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                <h3 className="font-medium">AquaBot Assistant</h3>
              </div>
              <Link href="/chat" className="text-xs text-white/80 hover:text-white">
                Full Chat
              </Link>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "350px" }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === "user" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start mb-1">
                      {msg.sender === "bot" && <Bot className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs opacity-70 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
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
            <form onSubmit={handleSendMessage} className="border-t p-2 flex">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" className="ml-2">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
