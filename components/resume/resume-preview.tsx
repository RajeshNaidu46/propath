"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Download, Share } from "lucide-react"

const resumeData = {
  name: "John Doe",
  title: "Senior Software Engineer",
  email: "john.doe@email.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  summary: "Experienced software engineer with 5+ years in full-stack development...",
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      duration: "2021 - Present",
      highlights: ["Led team of 5 developers", "Increased performance by 40%"],
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      duration: "2019 - 2021",
      highlights: ["Built scalable web applications", "Implemented CI/CD pipeline"],
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
}

export function ResumePreview() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">Resume Preview</CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Full View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2 p-4 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-bold">{resumeData.name}</h3>
          <p className="text-sm text-muted-foreground">{resumeData.title}</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{resumeData.email}</p>
            <p>
              {resumeData.phone} • {resumeData.location}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Professional Summary</h4>
          <p className="text-xs text-muted-foreground line-clamp-3">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Experience</h4>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{exp.position}</p>
                  <p className="text-xs text-muted-foreground">{exp.company}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {exp.duration}
                </Badge>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="list-disc">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {resumeData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
