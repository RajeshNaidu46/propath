"use client"

import { AssessmentInterface } from "@/components/assessments/assessment-interface"

interface AssessmentPageProps {
  params: {
    id: string
  }
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  return (
    <div className="container mx-auto py-6">
      <AssessmentInterface assessmentId={params.id} />
    </div>
  )
}
