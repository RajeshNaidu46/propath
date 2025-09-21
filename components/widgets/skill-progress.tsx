"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const weeklyData = [
  { period: "Week 1", javascript: 65, react: 60, python: 55 },
  { period: "Week 2", javascript: 70, react: 65, python: 58 },
  { period: "Week 3", javascript: 75, react: 70, python: 62 },
  { period: "Week 4", javascript: 80, react: 75, python: 68 },
  { period: "Week 5", javascript: 85, react: 78, python: 72 },
]

const monthlyData = [
  { period: "Jan", javascript: 60, react: 55, python: 50 },
  { period: "Feb", javascript: 68, react: 62, python: 58 },
  { period: "Mar", javascript: 75, react: 70, python: 65 },
  { period: "Apr", javascript: 82, react: 76, python: 70 },
  { period: "May", javascript: 85, react: 78, python: 72 },
]

export function SkillProgress() {
  const [view, setView] = useState<"weekly" | "monthly">("weekly")
  const data = view === "weekly" ? weeklyData : monthlyData

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">Skill Progress</CardTitle>
          <div className="flex gap-1">
            <Button variant={view === "weekly" ? "default" : "outline"} size="sm" onClick={() => setView("weekly")}>
              Weekly
            </Button>
            <Button variant={view === "monthly" ? "default" : "outline"} size="sm" onClick={() => setView("monthly")}>
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="period" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="javascript" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            <Line type="monotone" dataKey="react" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            <Line type="monotone" dataKey="python" stroke="hsl(var(--chart-3))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
