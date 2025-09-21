"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  mode: "online" | "offline"
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === "bot"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div className={`flex items-start gap-3 ${!isBot ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          isBot ? "bg-gradient-to-br from-secondary to-accent" : "bg-primary"
        }`}
      >
        {isBot ? (
          <Bot className="h-4 w-4 text-secondary-foreground" />
        ) : (
          <User className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${!isBot ? "text-right" : ""}`}>
        <div
          className={`p-3 rounded-lg ${
            isBot ? "bg-muted/50 text-foreground" : "bg-primary text-primary-foreground ml-auto"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Message Footer */}
        <div className={`flex items-center gap-2 mt-2 text-xs text-muted-foreground ${!isBot ? "justify-end" : ""}`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isBot && (
            <>
              <Badge variant="outline" className="text-xs">
                {message.mode}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
