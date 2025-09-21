"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, Clock, GraduationCap, Eye } from "lucide-react"

const courses = [
  {
    title: "Advanced React Patterns",
    provider: "TechEd Pro",
    rating: 4.8,
    duration: "6 hours",
    level: "Advanced",
    price: "$89",
  },
  {
    title: "Python for Data Science",
    provider: "DataLearn",
    rating: 4.9,
    duration: "12 hours",
    level: "Intermediate",
    price: "$129",
  },
  {
    title: "Leadership in Tech",
    provider: "CareerBoost",
    rating: 4.7,
    duration: "8 hours",
    level: "Beginner",
    price: "$79",
  },
]

export function CourseRecommendations() {
  return (
    <Card className="widget-card professional-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Course Recommendations
        </CardTitle>
        <CardDescription>AI-curated courses based on your skills and goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {courses.slice(0, 3).map((course) => (
            <div key={course.title} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{course.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{course.provider}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {course.duration}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full" variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View All Courses
        </Button>
      </CardContent>
    </Card>
  )
}
