"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResumeUpload } from "@/components/resume/resume-upload"
import { ResumeAnalysisResults } from "@/components/resume/resume-analysis-results"
import { AIResumeWriter } from "@/components/resume/ai-resume-writer"
import { 
  FileText, 
  Upload, 
  Brain, 
  Sparkles, 
  Settings 
} from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ResumeAnalysisPage() {
  const [activeTab, setActiveTab] = useState<"analyze" | "ai-writer">("analyze")
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [isAnalysisStarted, setIsAnalysisStarted] = useState(false)
  const [resumeContent, setResumeContent] = useState<string>("")

  const handleAnalysisComplete = (analysis: any) => {
    setAnalysisResults(analysis)
    setIsAnalysisStarted(false)
    if (analysis.resumeContent) setResumeContent(analysis.resumeContent)
  }

  const handleUploadStart = () => setIsAnalysisStarted(true)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Resume Intelligence</h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered resume analysis, creation, and optimization
          </p>
        </div>

        {/* Tab Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Resume Tools
            </CardTitle>
            <CardDescription>Choose your resume enhancement tool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
                <Button
                  variant={activeTab === "analyze" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("analyze")}
                  className="px-6"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Resume Analysis
                </Button>

                <Button
                  variant={activeTab === "ai-writer" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("ai-writer")}
                  className="px-6"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Resume Writer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {activeTab === "analyze" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <ResumeUpload 
                onAnalysisComplete={handleAnalysisComplete} 
                onUploadStart={handleUploadStart}
              />
            </div>
            <div className="xl:col-span-2 space-y-6">
              {analysisResults ? (
                <ResumeAnalysisResults resumeContent={resumeContent} />
              ) : isAnalysisStarted ? (
                <Card className="professional-card h-full flex items-center justify-center">
                  <CardContent className="text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-semibold">Analysis in Progress</p>
                    <p className="text-sm">Please wait while we analyze your resume...</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="professional-card h-full flex items-center justify-center">
                  <CardContent className="text-center text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold">Upload your resume to start analysis</p>
                    <p className="text-sm">Get instant feedback on ATS compatibility, skills, and content using advanced BERT and NLP models.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === "ai-writer" && (
          <div className="space-y-6">
            <AIResumeWriter />
          </div>
        )}

        {/* Features Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="professional-card hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                BERT-powered resume analysis with skill extraction and ATS optimization
              </p>
            </CardContent>
          </Card>

          <Card className="professional-card hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">AI Writer</h3>
              <p className="text-sm text-muted-foreground">
                Generate professional resumes with AI assistance and multiple styles
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
