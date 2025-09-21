"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

const categories = [
  { id: "technical", label: "Technical Skills", count: 156 },
  { id: "soft-skills", label: "Soft Skills", count: 89 },
  { id: "leadership", label: "Leadership", count: 67 },
  { id: "data-science", label: "Data Science", count: 134 },
  { id: "design", label: "Design", count: 78 },
  { id: "business", label: "Business", count: 92 },
]

const providers = [
  { id: "coursera", label: "Coursera", count: 245 },
  { id: "udemy", label: "Udemy", count: 189 },
  { id: "edx", label: "edX", count: 156 },
  { id: "linkedin", label: "LinkedIn Learning", count: 134 },
  { id: "pluralsight", label: "Pluralsight", count: 98 },
]

const levels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

export function CourseFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [durationRange, setDurationRange] = useState([1, 50])

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedProviders([])
    setSelectedLevels([])
    setDurationRange([1, 50])
  }

  const activeFiltersCount = selectedCategories.length + selectedProviders.length + selectedLevels.length

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Active Filters</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {categories.find((c) => c.id === category)?.label}
                </Badge>
              ))}
              {selectedProviders.map((provider) => (
                <Badge key={provider} variant="secondary" className="text-xs">
                  {providers.find((p) => p.id === provider)?.label}
                </Badge>
              ))}
              {selectedLevels.map((level) => (
                <Badge key={level} variant="secondary" className="text-xs">
                  {levels.find((l) => l.id === level)?.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category.id])
                    } else {
                      setSelectedCategories(selectedCategories.filter((c) => c !== category.id))
                    }
                  }}
                />
                <label htmlFor={category.id} className="text-sm cursor-pointer">
                  {category.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Providers */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={provider.id}
                  checked={selectedProviders.includes(provider.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedProviders([...selectedProviders, provider.id])
                    } else {
                      setSelectedProviders(selectedProviders.filter((p) => p !== provider.id))
                    }
                  }}
                />
                <label htmlFor={provider.id} className="text-sm cursor-pointer">
                  {provider.label}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">{provider.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Level */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Difficulty Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {levels.map((level) => (
            <div key={level.id} className="flex items-center space-x-2">
              <Checkbox
                id={level.id}
                checked={selectedLevels.includes(level.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLevels([...selectedLevels, level.id])
                  } else {
                    setSelectedLevels(selectedLevels.filter((l) => l !== level.id))
                  }
                }}
              />
              <label htmlFor={level.id} className="text-sm cursor-pointer">
                {level.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Duration */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Duration (hours)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={durationRange} onValueChange={setDurationRange} max={50} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{durationRange[0]}h</span>
            <span>{durationRange[1]}h+</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
