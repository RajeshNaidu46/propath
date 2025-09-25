"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import { bertNLPService } from "@/lib/bert-nlp-service"

import {
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  FileText,
  Zap,
  BarChart3,
  Lightbulb,
  Award
} from "lucide-react"

interface SkillEntity {
  skill: string
  confidence: number
  category: string
  context: string
}

interface ExperienceEntity {
  title: string
  company: string
  duration: string
  startDate?: string
  endDate?: string
  achievements: string[]
}

interface SentimentResult {
  tone: "professional" | "casual" | "confident" | "modest"
  confidence: number
  positivity: number
  emotions: { [key: string]: number }
}

interface ResumeAnalysis {
  skills: SkillEntity[]
  experience: ExperienceEntity[]
  sentiment: SentimentResult
  entities: { [key: string]: string[] }
  keywords: string[]
  readability: {
    score: number
    metrics: {
      wordCount: number
      sentenceCount: number
      avgSentenceLength: number
      fleschReadingEase: number
      gunningFogIndex: number
    }
  }
}

interface ResumeAnalysisResultsProps {
  resumeContent: string
  jobTitle?: string
}

export function ResumeAnalysisResults({
  resumeContent,
  jobTitle
}: ResumeAnalysisResultsProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [overallScore, setOverallScore] = useState<number>(0)
  const [atsScore, setAtsScore] = useState<number>(0)

  useEffect(() => {
    if (resumeContent) analyzeResume()
  }, [resumeContent, jobTitle])

  const analyzeResume = async () => {
    if (!resumeContent.trim()) {
      toast.error("No resume content to analyze")
      return
    }

    setIsAnalyzing(true)
    try {
      console.log("Starting BERT/NLP analysis...")
      const bertAnalysis = await bertNLPService.analyzeResume(
        resumeContent,
        jobTitle
      )

      console.log("BERT Analysis completed:", bertAnalysis)

      const calculatedOverallScore = calculateOverallScore(bertAnalysis)
      const calculatedAtsScore = calculateATSScore(bertAnalysis, jobTitle)

      setOverallScore(calculatedOverallScore)
      setAtsScore(calculatedAtsScore)
      setAnalysis(bertAnalysis)

      toast.success("Resume analysis completed successfully!")
    } catch (error) {
      console.error("Resume analysis error:", error)
      toast.error("Failed to analyze resume.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculateOverallScore = (analysis: ResumeAnalysis) => {
    let score = 0
    let totalWeight = 0

    const skillsScore =
      analysis.skills.length > 0
        ? Math.min(
            100,
            analysis.skills.length * 5 +
              analysis.skills.reduce(
                (acc, skill) => acc + skill.confidence * 100,
                0
              ) / analysis.skills.length
          )
        : 0
    score += skillsScore * 0.25
    totalWeight += 0.25

    score += analysis.readability.score * 0.2
    totalWeight += 0.2

    const experienceScore =
      analysis.experience.length > 0
        ? Math.min(
            100,
            analysis.experience.length * 20 +
              analysis.experience.reduce(
                (acc, exp) => acc + exp.achievements.length * 10,
                0
              )
          )
        : 0
    score += experienceScore * 0.2
    totalWeight += 0.2

    const keywordsScore =
      analysis.keywords.length > 0
        ? Math.min(100, analysis.keywords.length * 6.67)
        : 0
    score += keywordsScore * 0.15
    totalWeight += 0.15

    const sentimentScore =
      (analysis.sentiment.confidence + analysis.sentiment.positivity) * 50
    score += sentimentScore * 0.2
    totalWeight += 0.2

    return Math.round(score / totalWeight)
  }

  const calculateATSScore = (analysis: ResumeAnalysis, jobTitle?: string) => {
    let score = 0
    let totalWeight = 0

    const keywordScore = jobTitle
      ? calculateKeywordMatch(analysis.keywords, jobTitle)
      : Math.min(100, analysis.keywords.length * 6.67)
    score += keywordScore * 0.4
    totalWeight += 0.4

    const skillsScore =
      analysis.skills.length > 0
        ? Math.min(
            100,
            analysis.skills.filter((skill) => skill.confidence > 0.8).length * 5
          )
        : 0
    score += skillsScore * 0.3
    totalWeight += 0.3

    score += analysis.readability.score * 0.2
    totalWeight += 0.2

    const formatScore =
      analysis.readability.metrics.avgSentenceLength < 25
        ? 100
        : Math.max(
            0,
            100 - (analysis.readability.metrics.avgSentenceLength - 25) * 2
          )
    score += formatScore * 0.1
    totalWeight += 0.1

    return Math.round(score / totalWeight)
  }

  const calculateKeywordMatch = (keywords: string[], jobTitle: string) => {
    const jobKeywords = getJobKeywords(jobTitle)
    const matchedKeywords = keywords.filter((keyword) =>
      jobKeywords.some(
        (jobKeyword) =>
          keyword.toLowerCase().includes(jobKeyword.toLowerCase()) ||
          jobKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    return Math.min(100, (matchedKeywords.length / jobKeywords.length) * 100)
  }

  const getJobKeywords = (jobTitle: string) => {
    const jobKeywords: { [key: string]: string[] } = {
      "software engineer": [
        "programming",
        "development",
        "coding",
        "algorithms",
        "data structures",
        "software",
        "engineering"
      ],
      "data scientist": [
        "machine learning",
        "statistics",
        "python",
        "r",
        "sql",
        "analytics",
        "data",
        "science"
      ],
      "product manager": [
        "strategy",
        "roadmap",
        "agile",
        "scrum",
        "user research",
        "metrics",
        "product",
        "management"
      ],
      "devops engineer": [
        "docker",
        "kubernetes",
        "ci/cd",
        "aws",
        "azure",
        "infrastructure",
        "devops"
      ],
      "frontend developer": [
        "react",
        "javascript",
        "html",
        "css",
        "vue",
        "angular",
        "frontend",
        "ui"
      ],
      "backend developer": [
        "node.js",
        "python",
        "java",
        "databases",
        "apis",
        "microservices",
        "backend"
      ],
      fullstack: [
        "frontend",
        "backend",
        "full stack",
        "web development",
        "fullstack"
      ],
      "mobile developer": [
        "ios",
        "android",
        "mobile",
        "app development",
        "swift",
        "kotlin"
      ],
      "ui/ux designer": [
        "design",
        "user experience",
        "user interface",
        "figma",
        "adobe",
        "prototyping"
      ],
      "data analyst": [
        "sql",
        "excel",
        "data analysis",
        "reporting",
        "visualization",
        "analytics"
      ]
    }
    const lowerTitle = jobTitle.toLowerCase()
    for (const [job, keywords] of Object.entries(jobKeywords)) {
      if (lowerTitle.includes(job)) return keywords
    }
    return ["communication", "leadership", "problem solving", "teamwork"]
  }

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"

  const getScoreBgColor = (score: number) =>
    score >= 80 ? "bg-green-100" : score >= 60 ? "bg-yellow-100" : "bg-red-100"

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "professional":
        return "bg-blue-100 text-blue-800"
      case "confident":
        return "bg-green-100 text-green-800"
      case "casual":
        return "bg-yellow-100 text-yellow-800"
      case "modest":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI Resume Analysis in Progress
          </CardTitle>
          <CardDescription>Analyzing your resume...</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={50} className="h-2" />
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Resume Analysis</CardTitle>
          <CardDescription>Upload a resume to start analysis</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <FileText className="mx-auto h-12 w-12 opacity-50" />
          <p>No resume uploaded yet</p>
        </CardContent>
      </Card>
    )
  }

  return <div>{/* Your full results UI goes here */}</div>
}
