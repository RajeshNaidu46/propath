"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Award, Clock } from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from "recharts"

const overviewStats = {
  totalAssessments: 12,
  averageScore: 78,
  completionRate: 85,
  skillsImproved: 6,
}

const skillProgress = [
  { skill: "JavaScript", current: 85, previous: 75 },
  { skill: "React", current: 78, previous: 70 },
  { skill: "Python", current: 72, previous: 65 },
  { skill: "Communication", current: 88, previous: 82 },
  { skill: "Problem Solving", current: 82, previous: 78 },
]

const progressOverTime = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 78 },
  { month: "May", score: 78 },
]

export function AssessmentOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-1" />
              <div>
                <p className="text-2xl font-bold">{overviewStats.totalAssessments}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-2" />
              <div>
                <p className="text-2xl font-bold">{overviewStats.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-chart-3" />
              <div>
                <p className="text-2xl font-bold">{overviewStats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-chart-4" />
              <div>
                <p className="text-2xl font-bold">{overviewStats.skillsImproved}</p>
                <p className="text-xs text-muted-foreground">Skills Improved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Progress */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Skill Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillProgress.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{skill.previous}%</span>
                      <span>→</span>
                      <span className="text-chart-1 font-medium">{skill.current}%</span>
                    </div>
                  </div>
                  <Progress value={skill.current} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Over Time */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressOverTime}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-1))" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
