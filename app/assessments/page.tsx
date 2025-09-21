"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { AssessmentOverview } from "@/components/assessments/assessment-overview"
import { AvailableAssessments } from "@/components/assessments/available-assessments"
import { AssessmentHistory } from "@/components/assessments/assessment-history"
import { AssessmentInterface } from "@/components/assessments/assessment-interface"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, BarChart3, History } from "lucide-react"

export default function AssessmentsPage() {
  const [currentView, setCurrentView] = useState<"overview" | "assessment">("overview")

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {currentView === "overview" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Skill Assessments</h1>
                  <p className="text-muted-foreground">Test your skills across 50+ IT roles with AI-powered assessments</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Available Assessments - Main Focus */}
                  <div className="lg:col-span-3">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Available Assessments
                      </h2>
                    </div>
                    <AvailableAssessments onStartAssessment={() => setCurrentView("assessment")} />
                  </div>

                  {/* Overview Stats */}
                  <div className="lg:col-span-1">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Your Progress
                      </h2>
                    </div>
                    <AssessmentOverview />
                  </div>

                  {/* Assessment History */}
                  <div className="lg:col-span-4">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Assessment History
                      </h2>
                    </div>
                    <AssessmentHistory />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentView("overview")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Assessments
                  </Button>
                </div>
                <AssessmentInterface assessmentId="default" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
