"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, Heart, BookmarkPlus } from "lucide-react"

const courses = [
  {
    id: 4,
    title: "Full Stack Web Development Bootcamp",
    provider: "WebDev Pro",
    instructor: "Alex Thompson",
    rating: 4.8,
    students: 25600,
    duration: "40 hours",
    level: "Beginner",
    price: 149,
    originalPrice: 199,
    image: "/web-development-concept.png",
    tags: ["HTML", "CSS", "JavaScript", "Node.js"],
    category: "Technical",
    isPopular: true,
  },
  {
    id: 5,
    title: "Data Visualization with D3.js",
    provider: "DataViz Academy",
    instructor: "Maria Garcia",
    rating: 4.6,
    students: 8900,
    duration: "12 hours",
    level: "Intermediate",
    price: 89,
    originalPrice: 119,
    image: "/data-visualization-abstract.png",
    tags: ["D3.js", "JavaScript", "Data Analysis"],
    category: "Technical",
    isPopular: false,
  },
  {
    id: 6,
    title: "Effective Communication for Developers",
    provider: "SoftSkills Hub",
    instructor: "David Kim",
    rating: 4.7,
    students: 12300,
    duration: "6 hours",
    level: "Beginner",
    price: 59,
    originalPrice: 79,
    image: "/communication-skills.png",
    tags: ["Communication", "Presentation", "Teamwork"],
    category: "Soft Skills",
    isPopular: false,
  },
  {
    id: 7,
    title: "Machine Learning Fundamentals",
    provider: "AI Institute",
    instructor: "Dr. Jennifer Liu",
    rating: 4.9,
    students: 18700,
    duration: "24 hours",
    level: "Intermediate",
    price: 129,
    originalPrice: 179,
    image: "/machine-learning-concept.png",
    tags: ["Python", "ML", "AI", "Statistics"],
    category: "Data Science",
    isPopular: true,
  },
  {
    id: 8,
    title: "Agile Project Management",
    provider: "ProjectPro",
    instructor: "Robert Johnson",
    rating: 4.5,
    students: 9800,
    duration: "8 hours",
    level: "Intermediate",
    price: 79,
    originalPrice: 99,
    image: "/agile-project-management.png",
    tags: ["Agile", "Scrum", "Management"],
    category: "Business",
    isPopular: false,
  },
  {
    id: 9,
    title: "Advanced CSS & Animations",
    provider: "DesignCode",
    instructor: "Sophie Martin",
    rating: 4.8,
    students: 14200,
    duration: "10 hours",
    level: "Advanced",
    price: 99,
    originalPrice: 129,
    image: "/css-animations.png",
    tags: ["CSS", "Animations", "Frontend"],
    category: "Design",
    isPopular: false,
  },
]

export function CourseCatalog() {
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">Course Catalog</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("popular")}
            >
              Popular
            </Button>
            <Button variant={sortBy === "newest" ? "default" : "outline"} size="sm" onClick={() => setSortBy("newest")}>
              Newest
            </Button>
            <Button variant={sortBy === "rating" ? "default" : "outline"} size="sm" onClick={() => setSortBy("rating")}>
              Top Rated
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group bg-muted/30 border-border/50 hover:bg-muted/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {course.isPopular && (
                  <Badge className="absolute top-2 left-2 bg-chart-3 text-chart-3-foreground">Popular</Badge>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
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
                  {course.tags.slice(0, 3).map((tag) => (
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

                <Button className="w-full" size="sm">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="outline">Load More Courses</Button>
        </div>
      </CardContent>
    </Card>
  )
}
