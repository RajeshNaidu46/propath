"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Bot, User } from "lucide-react"

const recentMessages = [
  { type: "bot", message: "How can I help you with your career today?" },
  { type: "user", message: "I want to improve my resume" },
  { type: "bot", message: "I'd be happy to help! Let's start with your current experience..." },
]

export function CareerChatPreview() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Career Advice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-32 overflow-y-auto">
          {recentMessages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 ${msg.type === "user" ? "justify-end" : ""}`}>
              {msg.type === "bot" && <Bot className="h-4 w-4 mt-1 text-secondary" />}
              <div
                className={`text-xs p-2 rounded-lg max-w-[80%] ${
                  msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {msg.message}
              </div>
              {msg.type === "user" && <User className="h-4 w-4 mt-1 text-primary" />}
            </div>
          ))}
        </div>
        <Button className="w-full bg-transparent" variant="outline">
          Open Career Chat
        </Button>
      </CardContent>
    </Card>
  )
}
