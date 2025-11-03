"use client"

import { useState, useEffect } from "react"
import {
  Card, CardHeader, CardContent, CardTitle, CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { bertNLPService } from "@/lib/bertNLPService"
import {
  Brain, TrendingUp, FileText, Sparkles
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// ---------- Interfaces ----------
interface SkillEntity { skill: string; confidence: number; category: string; context: string }
interface ExperienceEntity { title: string; company: string; duration: string; startDate?: string; endDate?: string; achievements: string[] }
interface SentimentResult { tone: string; confidence: number; positivity: number; emotions: { [key: string]: number } }
interface Readability { score: number; metrics: { wordCount: number; sentenceCount: number; avgSentenceLength?: number; fleschReadingEase?: number } }
interface ResumeAnalysis {
  skills: SkillEntity[]
  experience: ExperienceEntity[]
  sentiment: SentimentResult
  keywords: string[]
  readability: Readability
  suggestions?: string[]
}

// ---------- Role skills ----------
const roleSkillsMap: { [role: string]: string[] } = {
  "Frontend Developer": ["JavaScript", "React", "HTML", "CSS", "TypeScript", "Redux"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Python", "REST API"],
  "Data Scientist": ["Python", "R", "Pandas", "NumPy", "Machine Learning", "SQL", "TensorFlow"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Terraform"]
}

// ---------- Metric weights ----------
const METRIC_WEIGHTS = {
  skills: 0.25,
  readability: 0.2,
  experience: 0.2,
  keywords: 0.15,
  sentiment: 0.2
}

// ---------- Component ----------
export function ResumeAnalysisResults({ resumeContent }: { resumeContent: string }) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [overallScore, setOverallScore] = useState<number>(0)
  const [atsScore, setAtsScore] = useState<number>(0)

  // Analyze when resume uploaded
  useEffect(() => {
    if (resumeContent.trim()) analyzeResume()
  }, [resumeContent])

  useEffect(() => {
    if (analysis && selectedRole) updateRoleAnalysis(selectedRole)
  }, [selectedRole])

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    try {
      const result = await bertNLPService.analyzeResume(resumeContent)
      setAnalysis(result)
      setOverallScore(calculateOverallScore(result))
    } catch (err) {
      console.error(err)
      toast.error("Failed to analyze resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const updateRoleAnalysis = (role: string) => {
    if (!analysis) return
    const requiredSkills = roleSkillsMap[role] || []
    const matchedCount = requiredSkills.filter((s) =>
      analysis.skills.map(a => a.skill.toLowerCase()).includes(s.toLowerCase())
    ).length
    setAtsScore(Math.round((matchedCount / requiredSkills.length) * 100))
  }

  const calculateOverallScore = (data: ResumeAnalysis) => {
    let total = 0
    let weightSum = 0
    for (const [metric, weight] of Object.entries(METRIC_WEIGHTS)) {
      const score = getMetricScore(metric as keyof ResumeAnalysis, data)
      total += score * weight
      weightSum += weight
    }
    return Math.round(total / weightSum)
  }

  const getMetricScore = (metric: keyof ResumeAnalysis, data: ResumeAnalysis) => {
    switch (metric) {
      case "skills": return Math.min(100, data.skills.reduce((a, s) => a + s.confidence * 100, 0) / (data.skills.length || 1))
      case "readability": return data.readability.score || 0
      case "experience": return Math.min(100, data.experience.length * 20)
      case "keywords": return Math.min(100, data.keywords.length * 6)
      case "sentiment": return (data.sentiment.confidence + data.sentiment.positivity) * 50
      default: return 0
    }
  }

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" /> Analyzing Resume...
          </CardTitle>
        </CardHeader>
        <CardContent><Progress value={50} className="h-2" /></CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="p-6 text-center">
        <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" />
        <CardTitle>No resume uploaded yet</CardTitle>
        <CardDescription>Upload a resume to start analysis</CardDescription>
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
            <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
            <SelectContent>
              {Object.keys(roleSkillsMap).map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRole && (
            <div className="mt-3">
              <h4 className="font-medium mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {roleSkillsMap[selectedRole].map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Overall Score: <span className={getScoreColor(overallScore)}>{overallScore}%</span>
            </span>
            {selectedRole && (
              <div className="text-sm font-medium">ATS Compatibility: <span className={getScoreColor(atsScore)}>{atsScore}%</span></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: "Skills", score: getMetricScore("skills", analysis) },
              { name: "Experience", score: getMetricScore("experience", analysis) },
              { name: "Keywords", score: getMetricScore("keywords", analysis) },
              { name: "Sentiment", score: getMetricScore("sentiment", analysis) },
              { name: "Readability", score: getMetricScore("readability", analysis) }
            ]}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Sparkles className="h-5 w-5" /> AI Resume Suggestions
            </CardTitle>
            <CardDescription>Personalized tips from AI to improve your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              {analysis.suggestions.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
