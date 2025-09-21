"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, TrendingUp, ExternalLink } from "lucide-react"
import { learningAPI } from "@/lib/api-services"

interface CourseRecommendation {
  id: string
  title: string
  provider: string
  rating: number
  price: number
  duration: string
  level: string
  trending: boolean
}

export function LiveCourseFeed() {
  const [courses, setCourses] = useState<CourseRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await learningAPI.getTrendingCourses()
        setCourses(data)
      } catch (error) {
        console.error("Failed to fetch trending courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
    // Refresh every 45 minutes
    const interval = setInterval(fetchCourses, 45 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-chart-2" />
          Live Course Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse p-3 bg-muted/30 rounded-lg">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          courses.slice(0, 4).map((course) => (
            <div key={course.id} className="p-3 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-2">{course.title}</h4>
                  <p className="text-xs text-muted-foreground">{course.provider}</p>
                </div>
                {course.trending && <Badge className="bg-chart-3/20 text-chart-3 text-xs ml-2">Trending</Badge>}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{course.duration}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {course.level}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">${course.price}</span>
                <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
