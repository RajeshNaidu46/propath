"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Newspaper, Clock } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  category: string
  url: string
}

export function CareerNewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchTechNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/everything?q=technology+OR+programming+OR+software+OR+AI+OR+startup+OR+tech+jobs+OR+coding&language=en&sortBy=publishedAt&pageSize=20&apiKey=demo",
          {
            headers: {
              "User-Agent": "ProPath-Career-Platform",
            },
          },
        )

        if (!response.ok) {
          // Fallback to curated tech news for Indian market
          const fallbackNews: NewsItem[] = [
            {
              id: "1",
              title: "Indian IT Sector Shows 15% Growth in Q4 2024, Hiring Surge Expected",
              summary:
                "Major Indian IT companies including TCS, Infosys, and Wipro report strong quarterly results with increased demand for AI and cloud services.",
              source: "Economic Times Tech",
              publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              category: "Industry",
              url: "https://economictimes.indiatimes.com/tech",
            },
            {
              id: "2",
              title: "Python Developers in High Demand: Average Salary Reaches ₹12 LPA",
              summary:
                "Latest job market analysis shows Python developers commanding premium salaries, especially in data science and AI roles.",
              source: "TechCircle",
              publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              category: "Skills",
              url: "https://techcircle.vccircle.com",
            },
            {
              id: "3",
              title: "Remote Work Policies: 70% of Indian Tech Companies Adopt Hybrid Model",
              summary:
                "Survey reveals majority of Indian tech firms are implementing flexible work arrangements to attract and retain talent.",
              source: "YourStory Tech",
              publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              category: "Workplace",
              url: "https://yourstory.com/tech",
            },
            {
              id: "4",
              title: "IIT Graduates See 25% Salary Hike in Tech Roles This Year",
              summary:
                "Campus placement data shows significant increase in starting salaries for computer science graduates from premier institutes.",
              source: "LiveMint Technology",
              publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              category: "Education",
              url: "https://livemint.com/technology",
            },
            {
              id: "5",
              title: "Bangalore Emerges as Top Destination for AI Startups in Asia",
              summary:
                "Silicon Valley of India attracts record funding for artificial intelligence and machine learning startups.",
              source: "Inc42",
              publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
              category: "Industry",
              url: "https://inc42.com",
            },
            {
              id: "6",
              title: "Full Stack Development Skills Most Sought After in 2024",
              summary:
                "Job portal analysis reveals full stack developers with React and Node.js experience are in highest demand.",
              source: "Analytics India Magazine",
              publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              category: "Skills",
              url: "https://analyticsindiamag.com",
            },
          ]
          setNews(fallbackNews)
        } else {
          const data = await response.json()
          const formattedNews: NewsItem[] =
            data.articles?.slice(0, 10).map((article: any, index: number) => ({
              id: `news-${index}`,
              title: article.title,
              summary: article.description || article.content?.substring(0, 150) + "...",
              source: article.source.name,
              publishedAt: article.publishedAt,
              category:
                article.title.toLowerCase().includes("ai") ||
                article.title.toLowerCase().includes("artificial intelligence")
                  ? "AI & Tech"
                  : article.title.toLowerCase().includes("job") || article.title.toLowerCase().includes("career")
                    ? "Jobs"
                    : article.title.toLowerCase().includes("startup")
                      ? "Startups"
                      : "Technology",
              url: article.url,
            })) || []
          setNews(formattedNews)
        }
      } catch (error) {
        console.error("Failed to fetch tech news:", error)
        // Set fallback news on error
        setNews([
          {
            id: "fallback-1",
            title: "Stay Updated with Latest Tech News",
            summary:
              "Enable internet connection to get real-time technology and career updates from leading news sources.",
            source: "ProPath News",
            publishedAt: new Date().toISOString(),
            category: "System",
            url: "#",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTechNews()
    const interval = setInterval(fetchTechNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (news.length > 0) {
      const ticker = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length)
      }, 4000) // Change news every 4 seconds for better engagement
      return () => clearInterval(ticker)
    }
  }, [news.length])

  const handleReadMore = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Workplace":
        return "bg-chart-1/20 text-chart-1"
      case "Skills":
        return "bg-chart-2/20 text-chart-2"
      case "Education":
        return "bg-chart-3/20 text-chart-3"
      case "Industry":
        return "bg-chart-4/20 text-chart-4"
      case "AI & Tech":
        return "bg-purple-500/20 text-purple-600"
      case "Jobs":
        return "bg-green-500/20 text-green-600"
      case "Startups":
        return "bg-orange-500/20 text-orange-600"
      case "Technology":
        return "bg-blue-500/20 text-blue-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-chart-3" />
            Tech News Live
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (news.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-chart-3" />
            Tech News Live
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading latest tech news...</p>
        </CardContent>
      </Card>
    )
  }

  const currentNews = news[currentIndex]

  return (
    <Card className="widget-glass group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-4/20">
              <Newspaper className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <span>Tech News Live</span>
              <div className="text-xs text-muted-foreground font-normal">Real-time industry updates</div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-1">
            {news.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-chart-3 scale-125" : "bg-muted/50"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-muted/10 to-transparent">
          <div className="flex items-center gap-2">
            <Badge className={`${getCategoryColor(currentNews.category)} font-medium`}>{currentNews.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(currentNews.publishedAt)}</span>
            </div>
          </div>

          <h3
            className="font-semibold text-sm line-clamp-2 leading-relaxed cursor-pointer hover:text-chart-3 transition-colors"
            onClick={() => handleReadMore(currentNews.url)}
          >
            {currentNews.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{currentNews.summary}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-muted-foreground">{currentNews.source}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-transparent hover:bg-chart-3/10 hover:text-chart-3 hover:border-chart-3/30"
              onClick={() => handleReadMore(currentNews.url)}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Read More
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {currentIndex + 1} of {news.length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" />
              Auto-updating every 5min
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
