"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Eye, Star, BookOpen } from "lucide-react"
import { getYouTubeCourses, courseCategories, type YouTubeCourse } from "@/lib/youtube-api"

export function YouTubeCourseRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState("web-development")
  const [courses, setCourses] = useState<YouTubeCourse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCourses(selectedCategory)
  }, [selectedCategory])

  const loadCourses = async (category: string) => {
    setLoading(true)
    try {
      const coursesData = await getYouTubeCourses(category)
      setCourses(coursesData)
    } catch (error) {
      console.error("Failed to load courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartLearning = (course: YouTubeCourse) => {
    // Track course progress in localStorage
    const progressData = {
      courseId: course.id,
      title: course.title,
      platform: course.platform || "YouTube",
      startedAt: new Date().toISOString(),
      progress: 0,
      category: selectedCategory,
    }

    // Get existing progress
    const existingProgress = JSON.parse(localStorage.getItem("courseProgress") || "[]")

    // Check if course already exists
    const existingIndex = existingProgress.findIndex((p: any) => p.courseId === course.id)

    if (existingIndex === -1) {
      // Add new course
      existingProgress.push(progressData)
    } else {
      // Update existing course
      existingProgress[existingIndex] = { ...existingProgress[existingIndex], ...progressData }
    }

    localStorage.setItem("courseProgress", JSON.stringify(existingProgress))

    // Open course in new tab
    window.open(course.url, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Free Learning Resources</h2>
        <p className="text-muted-foreground">
          Curated free courses from YouTube, Udemy, Coursera, edX, and other platforms
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-3">
        {courseCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <span>{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-20 bg-slate-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          : courses.map((course) => (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-l-green-500"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-600">
                    <span className="text-xs font-bold">100% FREE</span>
                  </Badge>
                  <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-600">
                    <span className="text-xs">{course.platform || "YouTube"}</span>
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">{course.channel}</p>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {course.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                    onClick={() => handleStartLearning(course)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Learning Free
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-slate-500">No courses found for this category. Try selecting a different category.</p>
        </div>
      )}
    </div>
  )
}
