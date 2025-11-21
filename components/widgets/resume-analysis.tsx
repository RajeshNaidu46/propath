"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Brain } from "lucide-react"

// We'll dynamically import the analyzer so we don't crash if import path / export type is wrong.
export default function ResumeAnalysisPage() {
  const [resumeContent, setResumeContent] = useState<string>("")
  const [Analyzer, setAnalyzer] = useState<React.ComponentType<any> | null>(null)
  const [analyzerError, setAnalyzerError] = useState<string | null>(null)

  useEffect(() => {
    // dynamic import to avoid render-time undefined component errors
    async function loadAnalyzer() {
      try {
        // try the most likely path first
        const mod = await import("@/components/ResumeAnalysisResults")
        // support both named and default export
        const Comp = (mod && (mod.ResumeAnalysisResults || mod.default)) as React.ComponentType<any> | undefined
        if (!Comp) {
          console.error("ResumeAnalysisResults import succeeded but no exported component found:", mod)
          setAnalyzerError("Analyzer found but no exported component (ResumeAnalysisResults). Check exports.")
          setAnalyzer(null)
          return
        }
        setAnalyzer(() => Comp)
        setAnalyzerError(null)
      } catch (err) {
        console.error("Dynamic import failed for @/components/ResumeAnalysisResults:", err)
        // try an alternative path (common variants)
        try {
          const mod2 = await import("@/components/resume-analysis/ResumeAnalysisResults")
          const Comp2 = (mod2 && (mod2.ResumeAnalysisResults || mod2.default)) as React.ComponentType<any> | undefined
          if (Comp2) {
            setAnalyzer(() => Comp2)
            setAnalyzerError(null)
            return
          }
        } catch (err2) {
          console.warn("Alternative import also failed:", err2)
        }
        setAnalyzerError("Failed to load ResumeAnalysisResults component. See console for details.")
        setAnalyzer(null)
      }
    }
    loadAnalyzer()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    // simple text extraction for .txt/.md and many text-like files; PDFs/DOCX require server-side parsing
    const text = await file.text()
    setResumeContent(text)
  }

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card className="widget-card professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Resume Analysis
          </CardTitle>
          <CardDescription>AI-powered resume insights and recommendations</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!resumeContent && (
            <>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-blue-700">Upload your resume to begin analysis</p>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => document.getElementById("resumeUpload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>

              <input
                id="resumeUpload"
                type="file"
                accept=".txt,.md,.pdf,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Analysis Component / Errors / Loading */}
      {resumeContent && (
        <>
          {!Analyzer && !analyzerError && (
            <Card>
              <CardHeader><CardTitle>Loading analyzer…</CardTitle></CardHeader>
              <CardContent>Attempting to load analysis component — check console for debug messages.</CardContent>
            </Card>
          )}

          {analyzerError && (
            <Card>
              <CardHeader><CardTitle>Error loading analyzer</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 mb-2">{analyzerError}</p>
                <p className="text-sm">Common fixes:</p>
                <ul className="list-disc ml-5 text-sm">
                  <li>Ensure file exports: <code>export function ResumeAnalysisResults(...) {}</code></li>
                  <li>Or export default: <code>export default ResumeAnalysisResults</code></li>
                  <li>Confirm component path: <code>components/ResumeAnalysisResults.tsx</code></li>
                </ul>
                <p className="mt-2 text-muted-foreground">Check browser console for the full import error stack.</p>
              </CardContent>
            </Card>
          )}

          {Analyzer && (
            // render the dynamically loaded component (pass the resume text)
            <Analyzer resumeContent={resumeContent} />
          )}
        </>
      )}
    </div>
  )
}
