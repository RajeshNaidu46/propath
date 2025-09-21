"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, RotateCcw, Eye } from "lucide-react"

const assessmentHistory = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Technical",
    score: 85,
    maxScore: 100,
    date: "2024-01-15",
    duration: "28 min",
    status: "completed",
    improvement: "+12%",
  },
  {
    id: 2,
    title: "Communication Skills",
    category: "Soft Skills",
    score: 92,
    maxScore: 100,
    date: "2024-01-10",
    duration: "18 min",
    status: "completed",
    improvement: "+8%",
  },
  {
    id: 3,
    title: "Problem Solving",
    category: "Cognitive",
    score: 78,
    maxScore: 100,
    date: "2024-01-05",
    duration: "42 min",
    status: "completed",
    improvement: "+15%",
  },
  {
    id: 4,
    title: "React Advanced Patterns",
    category: "Technical",
    score: 0,
    maxScore: 100,
    date: "2024-01-20",
    duration: "0 min",
    status: "in-progress",
    improvement: null,
  },
]

export function AssessmentHistory() {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-chart-1"
    if (percentage >= 60) return "text-chart-4"
    return "text-chart-3"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-chart-1/20 text-chart-1">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-chart-4/20 text-chart-4">In Progress</Badge>
      case "failed":
        return <Badge className="bg-chart-3/20 text-chart-3">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">Assessment History</CardTitle>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessmentHistory.map((assessment) => (
            <div key={assessment.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-sm">{assessment.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {assessment.category}
                  </Badge>
                  {getStatusBadge(assessment.status)}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{assessment.date}</span>
                  <span>Duration: {assessment.duration}</span>
                  {assessment.improvement && (
                    <div className="flex items-center gap-1 text-chart-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{assessment.improvement}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {assessment.status === "completed" && (
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(assessment.score, assessment.maxScore)}`}>
                      {assessment.score}/{assessment.maxScore}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((assessment.score / assessment.maxScore) * 100)}%
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {assessment.status === "completed" && (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {assessment.status === "in-progress" && <Button size="sm">Continue</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="outline">Load More Results</Button>
        </div>
      </CardContent>
    </Card>
  )
}
