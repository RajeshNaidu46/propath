"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Target, TrendingUp, MessageSquare, BookOpen, Users } from "lucide-react"

const suggestionCategories = [
  {
    title: "Resume & CV",
    icon: FileText,
    suggestions: [
      "How can I improve my resume?",
      "What keywords should I include?",
      "How to format my resume for ATS?",
      "Should I include a cover letter?",
    ],
  },
  {
    title: "Interview Prep",
    icon: MessageSquare,
    suggestions: [
      "Common interview questions",
      "How to prepare for technical interviews?",
      "What questions should I ask the interviewer?",
      "How to handle salary negotiations?",
    ],
  },
  {
    title: "Skill Development",
    icon: TrendingUp,
    suggestions: [
      "What skills are in demand?",
      "How to learn new programming languages?",
      "Best online courses for my career?",
      "How to showcase my skills?",
    ],
  },
  {
    title: "Career Planning",
    icon: Target,
    suggestions: [
      "How to change career paths?",
      "What's the job market like?",
      "How to set career goals?",
      "When should I look for a new job?",
    ],
  },
  {
    title: "Learning Resources",
    icon: BookOpen,
    suggestions: [
      "Best coding bootcamps",
      "Free learning platforms",
      "Industry certifications worth getting",
      "How to stay updated with trends?",
    ],
  },
  {
    title: "Networking",
    icon: Users,
    suggestions: [
      "How to build professional network?",
      "LinkedIn optimization tips",
      "Industry events to attend",
      "How to reach out to recruiters?",
    ],
  },
]

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-serif">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 bg-transparent"
            onClick={() => onSuggestionClick("I need help with my resume")}
          >
            <div>
              <p className="font-medium">Resume Review</p>
              <p className="text-xs text-muted-foreground">Get personalized feedback</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 bg-transparent"
            onClick={() => onSuggestionClick("How do I prepare for interviews?")}
          >
            <div>
              <p className="font-medium">Interview Prep</p>
              <p className="text-xs text-muted-foreground">Practice and tips</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 bg-transparent"
            onClick={() => onSuggestionClick("What skills should I learn?")}
          >
            <div>
              <p className="font-medium">Skill Planning</p>
              <p className="text-xs text-muted-foreground">Personalized roadmap</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {suggestionCategories.map((category) => (
          <Card key={category.title} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <category.icon className="h-4 w-4" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2 text-xs"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-4">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <Badge className="bg-secondary/20 text-secondary">Pro Tip</Badge>
            <p className="text-xs text-muted-foreground">
              Switch to online mode for more detailed, personalized responses powered by AI.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
