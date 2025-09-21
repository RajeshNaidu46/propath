"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Target, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const skills = [
  { name: "JavaScript", level: 85, color: "bg-chart-1", trend: "+5%", category: "Frontend" },
  { name: "React", level: 78, color: "bg-chart-2", trend: "+8%", category: "Frontend" },
  { name: "Python", level: 72, color: "bg-chart-3", trend: "+12%", category: "Backend" },
  { name: "SQL", level: 65, color: "bg-chart-4", trend: "+3%", category: "Database" },
  { name: "Node.js", level: 58, color: "bg-chart-5", trend: "+15%", category: "Backend" },
]

export function SkillPortfolio() {
  return (
    <Card className="widget-card professional-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Skill Portfolio
        </CardTitle>
        <CardDescription>Your technical and soft skills showcase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Technical Skills</span>
            <Badge variant="secondary">8 skills</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker"].map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Soft Skills</span>
            <Badge variant="secondary">5 skills</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Leadership", "Communication", "Problem Solving", "Teamwork", "Adaptability"].map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button className="w-full" variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </CardContent>
    </Card>
  )
}
