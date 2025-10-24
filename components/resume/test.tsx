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
import { bertNLPService } from "@/lib/bertNLPService"
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
import nlp from "compromise"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillEntity { skill: string; confidence: number; category: string; context: string }
interface ExperienceEntity { title: string; company: string; duration: string; startDate?: string; endDate?: string; achievements: string[] }
interface SentimentResult { tone: "professional" | "casual" | "confident" | "modest"; confidence: number; positivity: number; emotions: { [key: string]: number } }
interface SkillsGap { requiredSkills: string[]; missing: string[]; matched: string[]; weak: string[]; strong: string[]; confidenceMap: { [skill: string]: number } }
interface ResumeAnalysis {
  skills: SkillEntity[]
  experience: ExperienceEntity[]
  sentiment: SentimentResult
  entities: { [key: string]: string[] }
  keywords: string[]
  skillsGap?: SkillsGap
  readability: { score: number; metrics: { wordCount: number; sentenceCount: number; avgSentenceLength: number; fleschReadingEase: number; gunningFogIndex: number } }
}

interface ResumeAnalysisResultsProps { resumeContent: string }

const roleSkillsMap: { [role: string]: string[] } = {
  "Frontend Developer": ["JavaScript", "React", "HTML", "CSS", "TypeScript", "Redux"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Python", "REST API"],
  "Data Scientist": ["Python", "R", "Pandas", "NumPy", "Machine Learning", "SQL", "TensorFlow"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Terraform"]
}

export function ResumeAnalysisResults({ resumeContent }: ResumeAnalysisResultsProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [overallScore, setOverallScore] = useState<number>(0)
  const [atsScore, setAtsScore] = useState<number>(0)
  const [selectedRole, setSelectedRole] = useState<string>("")

  // Analyze resume when uploaded
  useEffect(() => {
    if (resumeContent.trim()) analyzeResume()
  }, [resumeContent])

  // Recalculate ATS & Skills Gap when role changes
  useEffect(() => {
    if (analysis) updateRoleAnalysis(selectedRole)
  }, [selectedRole])

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    try {
      const bertAnalysis = await bertNLPService.analyzeResume(resumeContent)
      setAnalysis(bertAnalysis)

      // initial scores (without role)
      const calcOverall = calculateOverallScore(bertAnalysis)
      const calcATS = calculateATSScore(bertAnalysis, [])

      setOverallScore(calcOverall)
      setAtsScore(calcATS)
    } catch (error) {
      console.error(error)
      toast.error("Failed to analyze resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const updateRoleAnalysis = (role: string) => {
    if (!analysis) return
    const roleSkills = role && roleSkillsMap[role] ? roleSkillsMap[role] : []
    const skillsGap = calculateSkillsGap(analysis, roleSkills)
    const ats = calculateATSScore(analysis, roleSkills)
    setAnalysis({ ...analysis, skillsGap })
    setAtsScore(ats)
  }

  const calculateOverallScore = (analysis: ResumeAnalysis) => {
    let score = 0
    let totalWeight = 0

    const skillsScore = analysis.skills.length > 0
      ? Math.min(100, analysis.skills.reduce((acc, s) => acc + s.confidence * 100, 0) / analysis.skills.length)
      : 0
    score += skillsScore * 0.25
    totalWeight += 0.25

    score += analysis.readability.score * 0.2
    totalWeight += 0.2

    const experienceScore = analysis.experience.length > 0
      ? Math.min(100, analysis.experience.length * 20 + analysis.experience.reduce((acc, e) => acc + e.achievements.length * 10, 0))
      : 0
    score += experienceScore * 0.2
    totalWeight += 0.2

    const keywordsScore = analysis.keywords.length > 0 ? Math.min(100, analysis.keywords.length * 6.67) : 0
    score += keywordsScore * 0.15
    totalWeight += 0.15

    const sentimentScore = (analysis.sentiment.confidence + analysis.sentiment.positivity) * 50
    score += sentimentScore * 0.2
    totalWeight += 0.2

    return Math.round(score / totalWeight)
  }

  const calculateATSScore = (analysis: ResumeAnalysis, requiredSkills: string[]) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0
    const resumeSkills = analysis.skills.map((s) => s.skill.toLowerCase())
    const matchedCount = requiredSkills.filter((rs) => resumeSkills.includes(rs.toLowerCase())).length
    return Math.round((matchedCount / requiredSkills.length) * 100)
  }

  const calculateSkillsGap = (analysis: ResumeAnalysis, requiredSkills: string[]) => {
    if (!requiredSkills || requiredSkills.length === 0) return undefined
    const resumeSkills = analysis.skills.map((s) => s.skill.toLowerCase())
    const matched: string[] = []
    const weak: string[] = []
    const missing: string[] = []
    const confidenceMap: { [skill: string]: number } = {}

    requiredSkills.forEach((skill) => {
      const found = analysis.skills.find((s) => s.skill.toLowerCase() === skill.toLowerCase())
      if (found) {
        confidenceMap[found.skill] = found.confidence
        if (found.confidence >= 0.7) matched.push(found.skill)
        else weak.push(found.skill)
      } else missing.push(skill)
    })
    return { requiredSkills, matched, weak, strong: matched, missing, confidenceMap }
  }

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "professional": return "bg-blue-100 text-blue-800"
      case "confident": return "bg-green-100 text-green-800"
      case "casual": return "bg-yellow-100 text-yellow-800"
      case "modest": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" /> AI Resume Analysis in Progress
          </CardTitle>
          <CardDescription>Analyzing your resume...</CardDescription>
        </CardHeader>
        <CardContent><Progress value={50} className="h-2" /></CardContent>
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

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <Card>
        <CardHeader><CardTitle>Select Target Role</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select a role" /></SelectTrigger>
            <SelectContent>
              {Object.keys(roleSkillsMap).map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
            </SelectContent>
          </Select>
          {selectedRole && roleSkillsMap[selectedRole] && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {roleSkillsMap[selectedRole].map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Scores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Overall Resume Score: <span className={getScoreColor(overallScore)}>{overallScore}%</span>
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-medium">ATS Compatibility</div>
              <div className={getScoreColor(atsScore)}>{atsScore}%</div>
            </div>
            <Progress value={overallScore} className="w-32 h-2" />
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}