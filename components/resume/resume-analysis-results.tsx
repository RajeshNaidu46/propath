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

// ---------- Types (same as before) ----------
interface SkillEntity { skill: string; confidence: number; category?: string; context?: string }
interface ExperienceEntity { title: string; company: string; duration: string; startDate?: string; endDate?: string; achievements?: string[] }
interface SentimentResult { tone: string; confidence: number; positivity?: number; emotions?: { [key: string]: number } }
interface Readability { score: number; metrics: { wordCount?: number; sentenceCount?: number; avgSentenceLength?: number; fleschReadingEase?: number } }
interface ATSScore { score: number; match: string }
interface ResumeAnalysis { skills: SkillEntity[]; experience: ExperienceEntity[]; sentiment: SentimentResult; keywords: string[]; readability: Readability; atsScore?: ATSScore; suggestions?: string[] }

// role map & metric weights unchanged
const roleSkillsMap: { [role: string]: string[] } = {
  "Frontend Developer": ["JavaScript", "React", "HTML", "CSS", "TypeScript", "Redux"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Python", "REST API"],
  "Data Scientist": ["Python", "R", "Pandas", "NumPy", "Machine Learning", "SQL", "TensorFlow"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Terraform"]
}
const METRIC_WEIGHTS: { [k: string]: number } = { skills: 0.25, readability: 0.2, experience: 0.2, keywords: 0.15, sentiment: 0.2 }

// clamp helper for UI
const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function ResumeAnalysisResults({ resumeContent }: { resumeContent: string }) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [overallScore, setOverallScore] = useState<number>(0)
  const [atsScore, setAtsScore] = useState<number>(0)
  const [jobDescription, setJobDescription] = useState<string>("") // new: JD input

  useEffect(() => {
    if (resumeContent && resumeContent.trim()) {
      analyzeResume()
    } else {
      setAnalysis(null); setOverallScore(0); setAtsScore(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeContent])

  useEffect(() => {
    if (analysis && selectedRole) updateRoleAnalysis(selectedRole)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole, analysis])

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    try {
      // pass JD so backend can compute ATS
      const result = await bertNLPService.analyzeResume(resumeContent, jobDescription)
      // safe defaults & clamp
      const safe: ResumeAnalysis = {
        skills: (result.skills || []).map((s: any) => ({ skill: s.skill ?? s.name ?? s, confidence: clamp(Number(s.confidence ?? s.score ?? 0.7), 0, 1), category: s.category, context: s.context })),
        experience: result.experience || [],
        sentiment: {
          tone: result.sentiment?.tone ?? "professional",
          confidence: clamp(Number(result.sentiment?.confidence ?? 0.8), 0, 1),
          positivity: clamp(Number(result.sentiment?.positivity ?? (result.sentiment?.confidence ?? 0.8) * 0.6), 0, 1),
          emotions: result.sentiment?.emotions ?? {}
        },
        keywords: result.keywords || [],
        readability: { score: clamp(Number(result.readability?.score ?? 0), 0, 100), metrics: result.readability?.metrics ?? {} },
        atsScore: result.atsScore ? { score: clamp(Number(result.atsScore.score ?? 0), 0, 100), match: result.atsScore.match ?? "" } : undefined,
        suggestions: result.suggestions || []
      }
      setAnalysis(safe)
      setOverallScore(calculateOverallScore(safe))
      setAtsScore(safe.atsScore ? Math.round(safe.atsScore.score) : 0)
    } catch (err) {
      console.error(err)
      toast.error("Failed to analyze resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const updateRoleAnalysis = (role: string) => {
    if (!analysis) return
    if (analysis.atsScore && typeof analysis.atsScore.score === "number" && analysis.atsScore.score > 0) {
      setAtsScore(Math.round(analysis.atsScore.score)); return
    }
    const requiredSkills = roleSkillsMap[role] || []
    if (requiredSkills.length === 0) { setAtsScore(0); return }
    const lowerSkills = analysis.skills.map(a => a.skill.toLowerCase())
    const matchedCount = requiredSkills.filter((s) => lowerSkills.includes(s.toLowerCase())).length
    setAtsScore(Math.round((matchedCount / requiredSkills.length) * 100))
  }

  const calculateOverallScore = (data: ResumeAnalysis) => {
    let total = 0; let weightSum = 0
    for (const [metric, weight] of Object.entries(METRIC_WEIGHTS)) {
      const score = getMetricScore(metric as keyof ResumeAnalysis, data)
      total += score * (weight ?? 0); weightSum += (weight ?? 0)
    }
    if (weightSum === 0) return 0
    return Math.round(clamp(total / weightSum, 0, 100))
  }

  const getMetricScore = (metric: keyof ResumeAnalysis, data: ResumeAnalysis) => {
    switch (metric) {
      case "skills": {
        const len = data.skills?.length || 0
        if (len === 0) return 0
        const avg = (data.skills.reduce((a, s) => a + (s.confidence ?? 0), 0) / len) * 100
        return clamp(Math.round(avg), 0, 100)
      }
      case "readability": {
        return clamp(Math.round(data.readability?.score ?? 0), 0, 100)
      }
      case "experience": {
        const expCount = data.experience?.length || 0
        return clamp(Math.min(100, expCount * 20), 0, 100)
      }
      case "keywords": {
        const kwCount = data.keywords?.length || 0
        return clamp(Math.min(100, kwCount * 6), 0, 100)
      }
      case "sentiment": {
        const conf = data.sentiment?.confidence ?? 0.5
        const pos = data.sentiment?.positivity ?? (conf > 0.6 ? 0.7 : 0.4)
        return clamp(Math.round(((conf + pos) / 2) * 100), 0, 100)
      }
      default: return 0
    }
  }

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"

  // Download JSON report
  const downloadReport = () => {
    if (!analysis) return
    const blob = new Blob([JSON.stringify({ analysis, overallScore, atsScore }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-analysis.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 animate-pulse" /> Analyzing Resume...</CardTitle></CardHeader>
        <CardContent><Progress value={50} className="h-2" /></CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="p-6 text-center">
        <FileText className="mx-auto h-12 w-12 opacity-50 mb-2" /><CardTitle>No resume uploaded yet</CardTitle><CardDescription>Upload a resume to start analysis</CardDescription>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Job Description input for ATS */}
      <Card>
        <CardHeader><CardTitle>Optional: Job Description (for ATS)</CardTitle></CardHeader>
        <CardContent>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here to compute ATS similarity..."
            className="w-full border rounded p-2 min-h-[80px]"
          />
          <div className="flex gap-2 mt-3">
            <button className="btn" onClick={() => analyzeResume()}>Re-run Analysis</button>
            <button className="btn-ghost" onClick={() => { setJobDescription(""); analyzeResume(); }}>Clear JD</button>
            <button className="ml-auto" onClick={downloadReport}>Download Report</button>
          </div>
        </CardContent>
      </Card>

      {/* rest of UI unchanged, bar chart will now use clamped values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Overall Score: <span className={getScoreColor(overallScore)}>{overallScore}%</span>
            </span>
            {selectedRole && (<div className="text-sm font-medium">ATS Compatibility: <span className={getScoreColor(atsScore)}>{atsScore}%</span></div>)}
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

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700"><Sparkles className="h-5 w-5" /> AI Resume Suggestions</CardTitle>
            <CardDescription>Personalized tips from AI to improve your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              {analysis.suggestions.map((tip, i) => (<li key={i}>{tip}</li>))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
