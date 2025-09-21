"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Briefcase, RefreshCw, MapPin } from "lucide-react"
import { jobMarketAPI } from "@/lib/api-services"

interface JobTrend {
  skill: string
  demand: number
  growth: number
  averageSalary: number
  jobCount: number
}

export function JobMarketTrends() {
  const [trends, setTrends] = useState<JobTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const data = await jobMarketAPI.getTrendingSkills()
      setTrends(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch job trends:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrends()
    // Refresh every 30 minutes
    const interval = setInterval(fetchTrends, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatSalary = (salary: number) => {
    return `${(salary / 100000).toFixed(1)} LPA`
  }

  return (
    <Card className="widget-glass group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-2/20 shrink-0">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-serif text-foreground">Job Market Trends</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>India Tech Market</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <RefreshCw
              className={`h-4 w-4 cursor-pointer text-muted-foreground hover:text-chart-1 transition-colors ${
                loading ? "animate-spin" : ""
              }`}
              onClick={fetchTrends}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted/50 rounded mb-2" />
                <div className="h-2 bg-muted/30 rounded" />
              </div>
            ))}
          </div>
        ) : (
          trends.slice(0, 6).map((trend, index) => (
            <div
              key={trend.skill}
              className="group/item p-3 rounded-lg hover:bg-muted/20 transition-all duration-200 border border-transparent hover:border-border/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-chart-1/20 to-chart-2/20 text-xs font-bold shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-foreground truncate">{trend.skill}</span>
                    <Badge className="bg-gradient-to-r from-chart-1/20 to-chart-2/20 text-chart-1 border-chart-1/30 text-xs font-medium shrink-0">
                      ↗ {trend.growth}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-md">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">{formatSalary(trend.averageSalary)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-md">
                      <Briefcase className="h-3 w-3" />
                      <span className="font-medium">{(trend.jobCount / 1000).toFixed(1)}k jobs</span>
                    </div>
                  </div>
                  <span className="font-medium text-chart-1 shrink-0">{trend.demand}%</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Market Demand</span>
                  </div>
                  <Progress value={trend.demand} className="h-2 bg-muted/30">
                    <div
                      className="h-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full transition-all duration-500"
                      style={{ width: `${trend.demand}%` }}
                    />
                  </Progress>
                </div>
              </div>
            </div>
          ))
        )}
        {!loading && trends.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Live data from Indian job portals</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
                Real-time updates
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
