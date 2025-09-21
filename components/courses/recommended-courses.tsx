"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, TrendingUp, Sparkles } from "lucide-react"

const recommendedCourses = [
  {
    id: 1,
    title: "Advanced React Patterns & Performance",
    provider: "TechEd Pro",
    instructor: "Sarah Chen",
    rating: 4.9,
    students: 12500,
    duration: "8 hours",
    level: "Advanced",
    price: 89,
    originalPrice: 129,
    image: "/react-course.png",
    tags: ["React", "JavaScript", "Performance"],
    matchScore: 95,
    reason: "Based on your JavaScript skills and recent React assessment",
  },
  {
    id: 2,
    title: "Leadership in Tech: From IC to Manager",
    provider: "CareerBoost",
    instructor: "Michael Rodriguez",
    rating: 4.8,
    students: 8900,
    duration: "12 hours",
    level: "Intermediate",
    price: 79,
    originalPrice: 99,
    image: "/leadership-course.png",
    tags: ["Leadership", "Management", "Career Growth"],
    matchScore: 88,
    reason: "Recommended for your career advancement goals",
  },
  {
    id: 3,
    title: "Python for Data Science Mastery",
    provider: "DataLearn",
    instructor: "Dr. Emily Watson",
    rating: 4.7,
    students: 15600,
    duration: "16 hours",
    level: "Intermediate",
    price: 99,
    originalPrice: 149,
    image: "/python-data-science.png",
    tags: ["Python", "Data Science", "Machine Learning"],
    matchScore: 82,
    reason: "Complements your programming background",
  },
]

export function RecommendedCourses() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-chart-1" />
          <CardTitle className="text-lg font-serif">AI-Recommended for You</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="group relative">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-chart-1 text-chart-1-foreground">{course.matchScore}% Match</Badge>
              </div>

              <Card className="h-full bg-muted/30 border-border/50 hover:bg-muted/50 transition-all duration-300 group-hover:shadow-lg">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {course.provider} • {course.instructor}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">${course.price}</span>
                      <span className="text-xs text-muted-foreground line-through">${course.originalPrice}</span>
                    </div>
                    <Badge className="bg-chart-2/20 text-chart-2">{course.level}</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground bg-chart-1/10 p-2 rounded">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {course.reason}
                  </div>

                  <Button className="w-full" size="sm">
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
