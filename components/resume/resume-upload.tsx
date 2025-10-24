"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  X, 
  Zap, 
  Brain,
  AlertCircle
} from "lucide-react"
import { bertNLPService } from "@/lib/bertNLPService"

interface ResumeUploadProps {
  onAnalysisComplete: (analysis: any) => void
  onUploadStart: () => void
  jobTitle?: string
}

export function ResumeUpload({ onAnalysisComplete, onUploadStart, jobTitle = "" }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local copy of jobTitle for analysis call
  const [localJobTitle] = useState(jobTitle)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) handleFileSelect(files[0])
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFileSelect(files[0])
  }

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }
    
    setError("")
    setUploadedFile(file)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setAnalysisData(null)
    setAnalysisComplete(false)
    setError("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const raw = reader.result
        let text = ""
        if (typeof raw === 'string') text = raw
        else if (raw instanceof ArrayBuffer) {
          try { text = new TextDecoder('utf-8').decode(new Uint8Array(raw)) } 
          catch { text = '' }
        }
        resolve(text || 'Resume content could not be fully extracted. Please ensure the PDF contains selectable text.')
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const startAnalysis = async () => {
    if (!uploadedFile) return
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setError("")
    onUploadStart()

    try {
      const textContent = await extractTextFromPDF(uploadedFile)

      // Simulate analysis progress
      const analysisInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(analysisInterval)
            return 90
          }
          return prev + 15
        })
      }, 1000)

      const bertResponse = await bertNLPService.analyzeResume(textContent, localJobTitle)
      
      clearInterval(analysisInterval)
      setAnalysisProgress(100)

      const formattedAnalysis = {
        resumeContent: textContent,
        jobTitle: localJobTitle,
        overallScore: Math.round(bertResponse.readability.score),
        skills: Array.from(new Set(bertResponse.skills.map(skill => skill.skill))),
        experience: bertResponse.experience.length,
        suggestions: [
          `Found ${bertResponse.skills.length} skills`,
          `${bertResponse.experience.length} work experiences detected`,
          `Readability score: ${bertResponse.readability.score}%`,
          `Overall tone: ${bertResponse.sentiment.tone}`
        ],
        jobMatching: bertResponse.sentiment.confidence * 100,
        structure: {
          hasSkills: bertResponse.skills.length > 0,
          hasExperience: bertResponse.experience.length > 0,
          hasKeywords: bertResponse.keywords.length > 0
        },
        wordCount: bertResponse.readability.metrics.wordCount,
        timestamp: new Date().toISOString(),
        service: 'BERT NLP'
      }

      setAnalysisData(formattedAnalysis)
      setAnalysisComplete(true)
      onAnalysisComplete(formattedAnalysis)
      
      setTimeout(() => setIsAnalyzing(false), 1000)

    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const uploadFile = async () => {
    if (!uploadedFile) return
    
    setIsUploading(true)
    setUploadProgress(0)
    setError("")

    try {
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(uploadInterval)
      setUploadProgress(100)
      
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        startAnalysis()
      }, 500)

    } catch (error) {
      console.error('Upload failed:', error)
      setError('Upload failed')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">AI Resume Analysis</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your resume (PDF, max 10MB) and get AI-powered analysis using advanced BERT NLP models
        </p>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!uploadedFile ? (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your resume here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  PDF files only, maximum 10MB
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">{uploadedFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {!isUploading && !isAnalyzing && (
                  <Button
                    onClick={uploadFile}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    size="lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start AI Analysis with BERT NLP
                  </Button>
                )}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Uploading Resume...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Analyzing with BERT NLP...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={analysisProgress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">{analysisProgress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Analysis Complete */}
      {analysisComplete && analysisData && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Analysis Complete! 🎉
                </h3>
                <p className="text-green-600">
                  Your resume has been analyzed using BERT NLP AI models
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-800">
                    {analysisData.overallScore}%
                  </div>
                  <div className="text-green-600">Completeness Score</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-800">
                    {analysisData.skills?.length || 0}
                  </div>
                  <div className="text-green-600">Skills Found</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
