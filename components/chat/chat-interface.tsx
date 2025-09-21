"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChatMessage } from "./chat-message"
import { ChatSuggestions } from "./chat-suggestions"
import { ChatbotService } from "@/lib/chatbot-service"
import { Send, Bot, Wifi, WifiOff, RotateCcw } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  mode: "online" | "offline"
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI career advisor. I can help you with resume tips, interview preparation, skill development, and career guidance. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      mode: "offline",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatbotService = new ChatbotService()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      mode: isOnline ? "online" : "offline",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setIsLoading(true)

    try {
      const response = await chatbotService.getResponse(inputValue, isOnline)

      // Simulate typing delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          sender: "bot",
          timestamp: new Date(),
          mode: response.mode,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      setIsTyping(false)
      setIsLoading(false)
      console.error("Chat error:", error)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI career advisor. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
        mode: "offline",
      },
    ])
  }

  const toggleMode = () => {
    setIsOnline(!isOnline)
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent">
                <Bot className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold font-serif">AI Career Advisor</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                    {isOnline ? (
                      <>
                        <Wifi className="h-3 w-3 mr-1" />
                        Online Mode
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 mr-1" />
                        Offline Mode
                      </>
                    )}
                  </Badge>
                  {isLoading && <div className="h-2 w-2 bg-chart-1 rounded-full animate-pulse" />}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleMode}>
                {isOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={clearChat}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent">
                <Bot className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="flex items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div
                    className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your career, resume, skills, or job search..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="w-80 border-l border-border/50 bg-card/30 backdrop-blur-sm">
        <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
      </div>
    </div>
  )
}
