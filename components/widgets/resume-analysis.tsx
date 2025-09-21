"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, TrendingUp, Brain } from "lucide-react"

export function ResumeAnalysis() {
  return (
    <Card className="widget-card professional-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Resume Analysis
        </CardTitle>
        <CardDescription>AI-powered resume insights and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-blue-700">Upload your resume to get started</p>
        </div>
        <Button className="w-full" variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload Resume
        </Button>
      </CardContent>
    </Card>
  )
}
