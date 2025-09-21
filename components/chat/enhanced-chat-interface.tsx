"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Upload, 
  Brain, 
  BookOpen, 
  Target,
  RefreshCw,
  MessageSquare,
  Lightbulb,
  Zap
} from "lucide-react"
import { geminiChatService, ChatMessage, ChatResponse } from "@/lib/gemini-service"
import { useRouter } from "next/navigation"

interface EnhancedChatInterfaceProps {
  className?: string
}

export function EnhancedChatInterface({ className }: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize chat on component mount
  useEffect(() => {
    // Load stored history if present
    const stored = typeof window !== 'undefined' ? localStorage.getItem(`chat_${sessionId}`) : null
    if (stored) {
      try {
        const parsed: ChatMessage[] = JSON.parse(stored)
        setMessages(parsed.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } catch {}
    } else {
      initializeChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Persist messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages))
    }
  }, [messages, sessionId])

  const initializeChat = async () => {
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
    setIsTyping(true)

    try {
      const response = await geminiChatService.sendMessage(inputMessage, sessionId)
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: { sessionId }
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Handle suggestions and actions
      if (response.suggestions || response.actions) {
        // Add suggestions as a special message with better formatting
        const suggestionsContent = response.suggestions ? 
          `💡 **Suggestions:**\n${response.suggestions.map(s => `• ${s}`).join('\n')}` : ''
        
        const actionsContent = response.actions ? 
          `🚀 **Next Steps:**\n${response.actions.map(a => `• ${a.label}: ${a.description}`).join('\n')}` : ''
        
        const combinedContent = [suggestionsContent, actionsContent].filter(Boolean).join('\n\n')
        
        if (combinedContent) {
          const suggestionsMessage: ChatMessage = {
            role: 'assistant',
            content: combinedContent,
            timestamp: new Date(),
            metadata: { sessionId }
          }
          setMessages(prev => [...prev, suggestionsMessage])
        }
      }

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
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleActionClick = (action: NonNullable<ChatResponse['actions']>[0]) => {
    switch (action.type) {
      case 'upload_resume':
        router.push('/resume')
        break
      case 'take_assessment':
        router.push('/assessments')
        break
      case 'view_courses':
        router.push('/courses')
        break
      case 'analyze_skills':
        router.push('/assessments')
        break
    }
  }

  const clearChat = () => {
    geminiChatService.clearChatHistory(sessionId)
    setMessages([])
    initializeChat()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }

  const exportChat = () => {
    try {
      const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `propath-chat-${new Date().toISOString().slice(0,10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {}
  }

  const regenerateLastResponse = async () => {
    if (isLoading) return
    // Find last user message
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        setInputMessage(messages[i].content)
        await handleSendMessage()
        break
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === 'user'
    const isLastMessage = index === messages.length - 1

    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>

          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}>
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content.split('\n').map((line, lineIndex) => {
                if (line.startsWith('💡 **Suggestions:**') || line.startsWith('🚀 **Next Steps:**')) {
                  return (
                    <div key={lineIndex} className="font-semibold text-sm mb-2 text-blue-600 dark:text-blue-400">
                      {line}
                    </div>
                  )
                } else if (line.startsWith('• ')) {
                  return (
                    <div key={lineIndex} className="ml-4 mb-1 text-sm">
                      {line}
                    </div>
                  )
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <div key={lineIndex} className="font-semibold mb-2">
                      {line.replace(/\*\*/g, '')}
                    </div>
                  )
                } else {
                  return (
                    <div key={lineIndex} className="mb-1">
                      {line}
                    </div>
                  )
                }
              })}
            </div>
            <div className={`text-xs mt-2 opacity-70 ${
              isUser ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}>
              {formatTime(message.timestamp)}
            </div>
            {/* Message actions */}
            <div className={`mt-2 flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => copyToClipboard(message.content)}>
                Copy
              </Button>
              {!isUser && index === messages.length - 1 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={regenerateLastResponse} disabled={isLoading}>
                  Regenerate
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold">ProPath AI Assistant</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your personal career intelligence companion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Gemini
            </Badge>
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={exportChat}>
              Export
            </Button>
            <Button variant="ghost" size="icon" onClick={clearChat} className="text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Chat Messages */}
        <ScrollArea className="h-[400px] sm:h-[500px] p-3 sm:p-4" ref={scrollAreaRef}>
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Prompts & Quick Actions */}
        <div className="border-t p-3 sm:p-4 bg-muted/30">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/resume')}
              className="text-xs h-8"
            >
              <Upload className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Resume Analysis</span>
              <span className="sm:hidden">Resume</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/assessments')}
              className="text-xs h-8"
            >
              <Brain className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Skills Assessment</span>
              <span className="sm:hidden">Skills</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/courses')}
              className="text-xs h-8"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Learning Paths</span>
              <span className="sm:hidden">Courses</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const roadmapPrompt = "I want a detailed career roadmap for becoming a data scientist. Please provide a step-by-step plan with timelines, skills to learn, and resources."
                setInputMessage(roadmapPrompt)
              }}
              className="text-xs h-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:bg-blue-100"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Get Roadmap</span>
              <span className="sm:hidden">Roadmap</span>
            </Button>
          </div>

          {/* Quick suggested prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
            {[
              'Create a 3-month plan to become a frontend developer',
              'Improve my resume for a data analyst role',
              'What skills do I need for cloud engineer?'
            ].map((prompt) => (
              <Button key={prompt} variant="outline" size="sm" className="justify-start h-8 text-xs" onClick={() => setInputMessage(prompt)}>
                {prompt}
              </Button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your career, resume, skills..."
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Helpful Tips */}
          <div className="mt-3 text-xs text-muted-foreground text-center">
            💡 Try: "Give me a roadmap for data science" or "How to become a web developer in 6 months?"
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
