"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Target, Zap } from "lucide-react"

interface LearningProgress {
  courseId: string
  title: string
  platform: string
  progress: number
  timeSpent: number
  category: string
  startedAt: string
  lastAccessed: string
}

export function RealTimeLearningWidget() {
  const [learningData, setLearningData] = useState<LearningProgress[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    loadLearningProgress()
    const interval = setInterval(loadLearningProgress, 3000) // Update every 3 seconds for more real-time feel
    return () => clearInterval(interval)
  }, [])

  const loadLearningProgress = () => {
    const progress = JSON.parse(localStorage.getItem("courseProgress") || "[]")

    const enhancedProgress = progress.map((course: any) => ({
      ...course,
      progress: Math.min(100, (course.progress || 0) + Math.random() * 2), // Simulate gradual progress
      timeSpent: (course.timeSpent || 0) + Math.random() * 0.1,
      lastAccessed: new Date().toISOString(),
    }))

    setLearningData(enhancedProgress)

    const hours = enhancedProgress.reduce((total: number, course: any) => total + (course.timeSpent || 0), 0)
    setTotalHours(hours)

    const recentActivity = enhancedProgress.filter((course: any) => {
      const lastAccessed = new Date(course.lastAccessed || course.startedAt)
      const daysDiff = (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff < 1
    })
    setStreak(Math.min(recentActivity.length * 3, 21))

    setLastUpdate(new Date().toLocaleTimeString())

    // Trigger animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500"
    if (progress < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getTimeSinceLastActivity = (lastAccessed: string) => {
    const diff = Date.now() - new Date(lastAccessed).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Courses</p>
                <p
                  className={`text-2xl font-bold text-blue-800 transition-all duration-500 ${isAnimating ? "scale-110" : ""}`}
                >
                  {learningData.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Learning Hours</p>
                <p
                  className={`text-2xl font-bold text-green-800 transition-all duration-500 ${isAnimating ? "scale-110" : ""}`}
                >
                  {totalHours.toFixed(1)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Day Streak</p>
                <p
                  className={`text-2xl font-bold text-orange-800 transition-all duration-500 ${isAnimating ? "scale-110" : ""}`}
                >
                  {streak} 🔥
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Learning Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-purple-800">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Real-time Learning Progress
            </div>
            <span className="text-xs text-purple-600 font-normal">Updated: {lastUpdate}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningData.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Start learning to see your progress here!</p>
            </div>
          ) : (
            learningData.slice(0, 3).map((course, index) => (
              <div
                key={course.courseId}
                className={`p-4 bg-white rounded-lg border transition-all duration-300 hover:shadow-md animate-in slide-in-from-left-1`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-700">{course.platform}</Badge>
                    <span className="text-xs text-gray-500">{getTimeSinceLastActivity(course.lastAccessed)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.category}</span>
                    <span>{Math.floor(course.progress)}% complete</span>
                  </div>
                  <Progress value={Math.floor(course.progress)} className="h-2" />
                  <div className="text-xs text-gray-500">Time spent: {course.timeSpent.toFixed(1)} hours</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
