"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Minimize2,
  Maximize2
} from "lucide-react"
import { geminiChatService, ChatMessage } from "@/lib/gemini-service"
import { useRouter } from "next/navigation"

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`widget_${Date.now()}`)
  const router = useRouter()

  const toggleChat = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
      initializeChat()
    }
  }

  const initializeChat = async () => {
    if (messages.length === 0) {
      try {
        const welcomeMessage = await geminiChatService.startChat(sessionId)
        setMessages([{
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
          metadata: { type: 'general', sessionId }
        }])
      } catch (error) {
        console.error('Failed to initialize chat:', error)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      metadata: { sessionId }
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await geminiChatService.sendMessage(inputMessage, sessionId)
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: { sessionId }
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
        metadata: { sessionId }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={toggleChat}
          size="lg"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <Card className={`w-72 sm:w-80 shadow-2xl border-0 ${isMinimized ? 'h-16' : 'h-80 sm:h-96'}`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              <CardTitle className="text-xs sm:text-sm font-semibold">ProPath AI</CardTitle>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0 hidden sm:inline-flex">
                <Sparkles className="w-3 h-3 mr-1" />
                Gemini
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-6 w-6"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-6 w-6"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-64 sm:h-80">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-2 sm:p-3">
              <div className="space-y-2 sm:space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      }`}>
                        {message.role === 'user' ? <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                      </div>
                      <div className={`rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        <div className={`text-xs mt-1 opacity-70 ${
                          message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-2 sm:p-3 bg-muted/30">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 text-xs sm:text-sm"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-3"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
