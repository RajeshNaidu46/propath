"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Award,
  Clock,
  Users,
  Briefcase,
  RefreshCw
} from "lucide-react"
import { bertNLPService } from "@/lib/bert-nlp-service"
import { toast } from "sonner"

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
  tone: 'professional' | 'casual' | 'confident' | 'modest'
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

export function ResumeAnalysisResults({ resumeContent, jobTitle }: ResumeAnalysisResultsProps) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [overallScore, setOverallScore] = useState<number>(0)
  const [atsScore, setAtsScore] = useState<number>(0)

  useEffect(() => {
    if (resumeContent) {
      analyzeResume()
    }
  }, [resumeContent, jobTitle])

  const analyzeResume = async () => {
    if (!resumeContent.trim()) {
      toast.error("No resume content to analyze")
      return
    }

    setIsAnalyzing(true)
    try {
      console.log('Starting BERT/NLP analysis...')
      console.log('Resume content length:', resumeContent.length)
      console.log('Job title:', jobTitle)

      // Use the real BERT NLP service
      const bertAnalysis = await bertNLPService.analyzeResume(resumeContent, jobTitle)
      
      console.log('BERT Analysis completed:', bertAnalysis)

      // Calculate overall score based on real analysis
      const calculatedOverallScore = calculateOverallScore(bertAnalysis)
      const calculatedAtsScore = calculateATSScore(bertAnalysis, jobTitle)
      
      setOverallScore(calculatedOverallScore)
      setAtsScore(calculatedAtsScore)

      setAnalysis(bertAnalysis as any)
      
      toast.success("Resume analysis completed using BERT and NLP!")
      
    } catch (error) {
      console.error('Resume analysis error:', error)
      toast.error("Failed to analyze resume. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculateOverallScore = (analysis: ResumeAnalysis): number => {
    let score = 0
    let totalWeight = 0

    // Skills weight: 25%
    const skillsScore = analysis.skills.length > 0 ? 
      Math.min(100, analysis.skills.length * 5 + analysis.skills.reduce((acc, skill) => acc + skill.confidence * 100, 0) / analysis.skills.length) : 0
    score += skillsScore * 0.25
    totalWeight += 0.25

    // Readability weight: 20%
    const readabilityScore = analysis.readability.score
    score += readabilityScore * 0.20
    totalWeight += 0.20

    // Experience weight: 20%
    const experienceScore = analysis.experience.length > 0 ? 
      Math.min(100, analysis.experience.length * 20 + analysis.experience.reduce((acc, exp) => acc + exp.achievements.length * 10, 0)) : 0
    score += experienceScore * 0.20
    totalWeight += 0.20

    // Keywords weight: 15%
    const keywordsScore = analysis.keywords.length > 0 ? 
      Math.min(100, analysis.keywords.length * 6.67) : 0
    score += keywordsScore * 0.15
    totalWeight += 0.15

    // Sentiment weight: 20%
    const sentimentScore = (analysis.sentiment.confidence + analysis.sentiment.positivity) * 50
    score += sentimentScore * 0.20
    totalWeight += 0.20

    const finalScore = Math.round(score / totalWeight)
    return Math.max(0, Math.min(100, finalScore))
  }

  const calculateATSScore = (analysis: ResumeAnalysis, jobTitle?: string): number => {
    let score = 0
    let totalWeight = 0

    // Keywords matching weight: 40%
    const keywordScore = jobTitle ? 
      calculateKeywordMatch(analysis.keywords, jobTitle) : 
      Math.min(100, analysis.keywords.length * 6.67)
    score += keywordScore * 0.40
    totalWeight += 0.40

    // Skills relevance weight: 30%
    const skillsScore = analysis.skills.length > 0 ? 
      Math.min(100, analysis.skills.filter(skill => skill.confidence > 0.8).length * 5) : 0
    score += skillsScore * 0.30
    totalWeight += 0.30

    // Readability weight: 20%
    const readabilityScore = analysis.readability.score
    score += readabilityScore * 0.20
    totalWeight += 0.20

    // Format weight: 10%
    const formatScore = analysis.readability.metrics.avgSentenceLength < 25 ? 100 : 
      Math.max(0, 100 - (analysis.readability.metrics.avgSentenceLength - 25) * 2)
    score += formatScore * 0.10
    totalWeight += 0.10

    const finalScore = Math.round(score / totalWeight)
    return Math.max(0, Math.min(100, finalScore))
  }

  const calculateKeywordMatch = (keywords: string[], jobTitle: string): number => {
    const jobKeywords = getJobKeywords(jobTitle)
    const matchedKeywords = keywords.filter(keyword => 
      jobKeywords.some(jobKeyword => 
        keyword.toLowerCase().includes(jobKeyword.toLowerCase()) ||
        jobKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    return Math.min(100, (matchedKeywords.length / jobKeywords.length) * 100)
  }

  const getJobKeywords = (jobTitle: string): string[] => {
    const jobKeywords: { [key: string]: string[] } = {
      'software engineer': ['programming', 'development', 'coding', 'algorithms', 'data structures', 'software', 'engineering'],
      'data scientist': ['machine learning', 'statistics', 'python', 'r', 'sql', 'analytics', 'data', 'science'],
      'product manager': ['strategy', 'roadmap', 'agile', 'scrum', 'user research', 'metrics', 'product', 'management'],
      'devops engineer': ['docker', 'kubernetes', 'ci/cd', 'aws', 'azure', 'infrastructure', 'devops'],
      'frontend developer': ['react', 'javascript', 'html', 'css', 'vue', 'angular', 'frontend', 'ui'],
      'backend developer': ['node.js', 'python', 'java', 'databases', 'apis', 'microservices', 'backend'],
      'full stack': ['frontend', 'backend', 'full stack', 'web development', 'fullstack'],
      'mobile developer': ['ios', 'android', 'mobile', 'app development', 'swift', 'kotlin'],
      'ui/ux designer': ['design', 'user experience', 'user interface', 'figma', 'adobe', 'prototyping'],
      'data analyst': ['sql', 'excel', 'data analysis', 'reporting', 'visualization', 'analytics']
    }

    const lowerTitle = jobTitle.toLowerCase()
    for (const [job, keywords] of Object.entries(jobKeywords)) {
      if (lowerTitle.includes(job)) {
        return keywords
      }
    }

    // Default keywords for any job
    return ['communication', 'leadership', 'problem solving', 'teamwork', 'project management']
  }

  const generateRecommendations = () => {
    if (!analysis) return []
    
    const recommendations = []

    // ATS Optimization recommendations
    if (atsScore < 80) {
      recommendations.push({
        priority: 'high' as const,
        category: 'ATS Optimization',
        suggestion: `Add missing keywords for ${jobTitle || 'your target role'} to improve ATS matching`,
        impact: 'High - Will improve ATS matching by 15-25%'
      })
    }

    // Skills recommendations
    if (analysis.skills.length < 8) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Skills',
        suggestion: 'Add more specific technical and soft skills to demonstrate your expertise',
        impact: 'High - Will show comprehensive skill set to recruiters'
      })
    }

    // Readability recommendations
    if (analysis.readability.metrics.avgSentenceLength > 25) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Content',
        suggestion: 'Break down long sentences for better readability and ATS parsing',
        impact: 'Medium - Will improve readability and ATS compatibility'
      })
    }

    // Experience recommendations
    if (analysis.experience.length === 0) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Experience',
        suggestion: 'Add work experience, internships, or project details to showcase your background',
        impact: 'High - Essential for demonstrating practical experience'
      })
    }

    // Keywords recommendations
    if (analysis.keywords.length < 10) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Keywords',
        suggestion: 'Include more industry-specific terms and technologies in your resume',
        impact: 'Medium - Will improve searchability and relevance'
      })
    }

    // Sentiment recommendations
    if (analysis.sentiment.confidence < 0.7) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Tone',
        suggestion: 'Use more confident and professional language throughout your resume',
        impact: 'Medium - Will project stronger professional image'
      })
    }

    // Format recommendations
    if (analysis.readability.score < 70) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Formatting',
        suggestion: 'Improve overall structure and formatting for better readability',
        impact: 'Medium - Will enhance professional appearance'
      })
    }

    return recommendations.slice(0, 6) // Show top 6 recommendations
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'bg-blue-100 text-blue-800'
      case 'confident': return 'bg-green-100 text-green-800'
      case 'casual': return 'bg-yellow-100 text-yellow-800'
      case 'modest': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isAnalyzing) {
    return (
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI Resume Analysis in Progress
          </CardTitle>
          <CardDescription>
            Using BERT and NLP models to analyze your resume content...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-muted-foreground">
                Processing resume content with advanced NLP models...
              </span>
            </div>
            <Progress value={65} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Analyzing: Content structure, skill extraction, ATS optimization, sentiment analysis
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="professional-card">
        <CardHeader>
          <CardTitle>Resume Analysis</CardTitle>
          <CardDescription>
            Upload a resume to get AI-powered analysis using BERT and NLP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resume uploaded yet</p>
            {resumeContent && (
              <div className="mt-4 space-y-3">
                <p className="text-sm">Resume content detected. Click "Re-analyze" to start analysis.</p>
                {/* Re-analyze button removed for static generation compatibility */}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="professional-card">
      <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Resume Score
          </CardTitle>
          <CardDescription>
            AI-powered analysis using BERT and NLP models
          </CardDescription>
      </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(overallScore)}`}>
              <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {overallScore >= 80 ? 'Excellent Resume!' : 
                 overallScore >= 60 ? 'Good Resume!' : 'Resume Needs Improvement'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {overallScore >= 80 ? 'Your resume shows strong potential with room for optimization' :
                 overallScore >= 60 ? 'Your resume has good elements but could benefit from enhancements' :
                 'Your resume needs significant improvements to be competitive'}
              </p>
            </div>
            {/* Re-analyze button removed for static generation compatibility */}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive breakdown using advanced NLP techniques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ats" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="ats">ATS Score</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="sentiment">Tone</TabsTrigger>
            </TabsList>

            {/* ATS Optimization */}
            <TabsContent value="ats" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">ATS Optimization Score</h4>
                <Badge className={`${getScoreColor(atsScore)} ${getScoreBgColor(atsScore)}`}>
                  {atsScore}%
          </Badge>
        </div>
              <Progress value={atsScore} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Detected Keywords
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Missing Keywords
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {jobTitle ? (
                      getJobKeywords(jobTitle)
                        .filter(keyword => !analysis.keywords.some(k => 
                          k.toLowerCase().includes(keyword.toLowerCase()) ||
                          keyword.toLowerCase().includes(k.toLowerCase())
                        ))
                        .slice(0, 5)
                        .map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs text-red-600 border-red-300">
                            {keyword}
                          </Badge>
                        ))
                    ) : (
                      <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                        Enter job title to see missing keywords
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Issues Found</h5>
                <ul className="space-y-1">
                  {atsScore < 80 && (
                    <li className="text-sm text-red-600 flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      ATS score is below optimal. Add more relevant keywords for your target role.
                    </li>
                  )}
                  {analysis.readability.metrics.avgSentenceLength > 25 && (
                    <li className="text-sm text-red-600 flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      Sentences are too long. Keep them under 25 words for better readability.
                    </li>
                  )}
                  {analysis.skills.length < 5 && (
                    <li className="text-sm text-red-600 flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      Add more specific skills to improve your resume's impact.
                    </li>
                  )}
                  {analysis.experience.length === 0 && (
                    <li className="text-sm text-red-600 flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      No work experience detected. Consider adding internships or projects.
                    </li>
                  )}
                </ul>
              </div>
            </TabsContent>

            {/* Content Analysis */}
            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysis.readability.score}</div>
                  <div className="text-xs text-blue-700">Readability Score</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analysis.readability.metrics.wordCount}</div>
                  <div className="text-xs text-green-700">Word Count</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analysis.readability.metrics.sentenceCount}</div>
                  <div className="text-xs text-purple-700">Sentences</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analysis.readability.metrics.avgSentenceLength}</div>
                  <div className="text-xs text-orange-700">Avg. Sentence Length</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    Strong Action Verbs
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {/* This section would ideally show strong action verbs */}
                    {/* For now, it's a placeholder */}
                    <Badge variant="secondary" className="text-xs">
                      Develop, Implement, Lead, Manage, Optimize, Design
                    </Badge>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Weak Words to Replace
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {/* This section would ideally show weak words to replace */}
                    {/* For now, it's a placeholder */}
                    <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                      Helped, Assisted, Tried, Attempted
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Skills Analysis */}
            <TabsContent value="skills" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Technical Skills</h5>
                  <div className="space-y-2">
                    {analysis.skills.map((skill) => (
                      <div key={skill.skill} className="flex items-center justify-between">
                        <span className="text-sm">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={skill.confidence * 100} 
                            className="w-20 h-2" 
                          />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(skill.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-3">Soft Skills</h5>
                  <div className="space-y-2">
                    {analysis.skills
                      .filter(skill => skill.category.toLowerCase().includes('soft'))
                      .slice(0, 10)
                      .map((skill) => (
                        <div key={skill.skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill.skill}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={skill.confidence * 100} 
                              className="w-20 h-2" 
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(skill.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Skill Categories</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(
                    analysis.skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = []
                      acc[skill.category].push(skill.skill)
                      return acc
                    }, {} as { [key: string]: string[] })
                  ).map(([category, skills]) => (
                    <div key={category} className="p-3 border rounded-lg">
                      <h6 className="font-medium text-sm mb-2">{category}</h6>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Experience Analysis */}
            <TabsContent value="experience" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysis.experience.length}</div>
                  <div className="text-sm text-blue-700">Roles</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.experience.reduce((acc, exp) => acc + exp.achievements.length, 0)}
                  </div>
                  <div className="text-sm text-green-700">Total Achievements</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysis.experience.length > 0 ? 
                      Math.round(analysis.experience.reduce((acc, exp) => acc + exp.achievements.length, 0) / analysis.experience.length) : 0
                    }
                  </div>
                  <div className="text-sm text-purple-700">Avg. Achievements per Role</div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Work Experience Details</h5>
                <div className="space-y-4">
                  {analysis.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <h6 className="font-semibold text-gray-900">{exp.title}</h6>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-500 mb-2">{exp.duration}</p>
                      {exp.achievements.length > 0 && (
                        <ul className="space-y-1">
                          {exp.achievements.slice(0, 3).map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="text-sm text-gray-700 flex items-start gap-2">
                              <Award className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Sentiment Analysis */}
            <TabsContent value="sentiment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary capitalize">{analysis.sentiment.tone}</div>
                  <div className="text-sm text-muted-foreground">Overall Tone</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{Math.round(analysis.sentiment.confidence * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Confidence Level</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{Math.round(analysis.sentiment.positivity * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Positivity Score</div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-lg border">
                <h5 className="font-medium mb-2 text-foreground">Tone Analysis</h5>
                <p className="text-sm text-muted-foreground">
                  Your resume demonstrates a {analysis.sentiment.tone} tone with high confidence levels. 
                  This suggests strong self-assurance and professional communication skills.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on BERT and NLP analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
          {generateRecommendations().map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{rec.category}</h4>
                  <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.suggestion}</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Impact:</strong> {rec.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
  )
}
