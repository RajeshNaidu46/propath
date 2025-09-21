"use client"

import { EnhancedChatInterface } from "@/components/chat/enhanced-chat-interface"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Career Assistant
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get personalized career guidance, resume tips, skill assessments, and learning recommendations from your AI companion powered by Gemini.
        </p>
      </div>
      
      <EnhancedChatInterface />
    </div>
  )
}
