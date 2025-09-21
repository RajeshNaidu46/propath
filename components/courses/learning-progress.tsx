"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen, Award, Calendar } from "lucide-react"

const enrolledCourses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    provider: "CodeAcademy",
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    nextLesson: "Async/Await Patterns",
    dueDate: "2024-01-25",
    certificate: true,
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    provider: "DesignHub",
    progress: 45,
    totalLessons: 16,
    completedLessons: 7,
    nextLesson: "Color Theory",
    dueDate: "2024-02-01",
    certificate: true,
  },
  {
    id: 3,
    title: "Project Management Basics",
    provider: "BizLearn",
    progress: 90,
    totalLessons: 12,
    completedLessons: 11,
    nextLesson: "Final Assessment",
    dueDate: "2024-01-20",
    certificate: true,
  },
]

export function LearningProgress() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-chart-2" />
            <CardTitle className="text-lg font-serif">My Learning Progress</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm">{course.title}</h3>
                  <p className="text-xs text-muted-foreground">{course.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  {course.certificate && <Award className="h-4 w-4 text-chart-4" />}
                  <Badge variant="outline" className="text-xs">
                    {course.progress}% Complete
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium">Next: {course.nextLesson}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Due {course.dueDate}</span>
                  </div>
                </div>
                <Button size="sm" className="bg-transparent" variant="outline">
                  <Play className="h-3 w-3 mr-1" />
                  Continue
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
