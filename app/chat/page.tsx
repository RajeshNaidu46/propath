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
          Get personalized career guidance, resume tips, skill assessments, and learning recommendations from your AI companion powered by chatbase.
        </p>
<iframe
  className="iframe"
  src="https://www.chatbase.co/chatbot-iframe/0hsoxkT2LDM08KOVUoLEH"
  style={{ 
    width: '600px', 
    height: '500px', 
    display: 'block', 
    margin: '0 auto', 
    border: 'none', 
    borderRadius: '12px' 
  }}
></iframe>
</div>

      
      {/* <EnhancedChatInterface /> */}
    </div>
  )
}
