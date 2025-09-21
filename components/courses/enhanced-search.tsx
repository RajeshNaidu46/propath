"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Briefcase, Play, Users } from "lucide-react"

interface SearchSuggestion {
  id: string
  title: string
  type: "role" | "skill" | "course"
  category: string
  trending?: boolean
  courses: number
}

const searchSuggestions: SearchSuggestion[] = [
  { id: "1", title: "Full Stack Developer", type: "role", category: "Development", trending: true, courses: 45 },
  { id: "2", title: "Data Scientist", type: "role", category: "Data Science", trending: true, courses: 38 },
  { id: "3", title: "DevOps Engineer", type: "role", category: "Infrastructure", courses: 32 },
  { id: "4", title: "React.js", type: "skill", category: "Frontend", courses: 67 },
  { id: "5", title: "Python Programming", type: "skill", category: "Programming", trending: true, courses: 89 },
  { id: "6", title: "Machine Learning", type: "skill", category: "AI/ML", courses: 54 },
  { id: "7", title: "UI/UX Designer", type: "role", category: "Design", courses: 41 },
  { id: "8", title: "Cloud Architect", type: "role", category: "Cloud", trending: true, courses: 29 },
  { id: "9", title: "Cybersecurity Analyst", type: "role", category: "Security", courses: 36 },
  { id: "10", title: "Mobile App Developer", type: "role", category: "Mobile", courses: 43 },
]

interface EnhancedSearchProps {
  onSearch: (query: string, filters: any) => void
}

export function EnhancedSearch({ onSearch }: EnhancedSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchSuggestions.filter(
        (suggestion) =>
          suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.category.toLowerCase().includes(query.toLowerCase()),
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions(searchSuggestions.slice(0, 6))
      setShowSuggestions(false)
    }
  }, [query])

  const handleSearch = (searchTerm: string) => {
    setIsAnimating(true)
    setQuery(searchTerm)
    onSearch(searchTerm, { type: "search" })
    setShowSuggestions(false)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.title)
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Enhanced Search Bar */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600 transition-all duration-300 ${isAnimating ? "animate-spin" : ""}`}
            />
            <Input
              placeholder="Search IT roles, skills, or courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="pl-12 pr-4 py-3 text-lg border-0 bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-300"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                ×
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Suggestions */}
      {(showSuggestions || query.length === 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-md border shadow-xl animate-in slide-in-from-top-2 duration-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              {query.length === 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Trending Searches</span>
                </div>
              )}

              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 group animate-in slide-in-from-left-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      {suggestion.type === "role" ? (
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Play className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{suggestion.title}</span>
                        {suggestion.trending && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">🔥 Trending</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{suggestion.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-3 w-3" />
                    {suggestion.courses} courses
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
