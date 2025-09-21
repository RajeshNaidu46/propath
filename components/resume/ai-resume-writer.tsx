"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Wand2,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github
} from "lucide-react"
import { geminiChatService } from "@/lib/gemini-service"
import { useToast } from "@/hooks/use-toast"

interface ResumeSection {
  id: string
  title: string
  content: string
  isExpanded: boolean
}

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    portfolio: string
  }
  summary: string
  experience: ResumeSection[]
  education: ResumeSection[]
  skills: string[]
  certifications: ResumeSection[]
  projects: ResumeSection[]
    languages: string[]
}

export function AIResumeWriter() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: []
  })
  const [generatedResume, setGeneratedResume] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [industry, setIndustry] = useState("")
  const [targetCompany, setTargetCompany] = useState("")
  const [resumeStyle, setResumeStyle] = useState("")
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | string[]) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.')
    setResumeData(prev => ({
      ...prev,
      [section]: {
          ...(prev[section as keyof ResumeData] as any),
          [key]: value
      }
    }))
    } else {
    setResumeData(prev => ({
      ...prev,
        [field]: value
      }))
    }
  }

  const addSection = (sectionType: keyof ResumeData) => {
    const newSection: ResumeSection = {
      id: `${sectionType}_${Date.now()}`,
      title: "",
      content: "",
      isExpanded: true
    }
    
    setResumeData(prev => ({
      ...prev,
      [sectionType]: [...(prev[sectionType] as ResumeSection[]), newSection]
    }))
  }

  const updateSection = (sectionType: keyof ResumeData, id: string, field: keyof ResumeSection, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      [sectionType]: (prev[sectionType] as ResumeSection[]).map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }))
  }

  const removeSection = (sectionType: keyof ResumeData, id: string) => {
    setResumeData(prev => ({
      ...prev,
      [sectionType]: (prev[sectionType] as ResumeSection[]).filter(section => section.id !== id)
    }))
  }

  const toggleSection = (sectionType: keyof ResumeData, id: string) => {
    const section = (resumeData[sectionType] as ResumeSection[]).find(s => s.id === id)
    if (section) {
      updateSection(sectionType, id, 'isExpanded', !section.isExpanded)
    }
  }

  const generateResumeWithAI = async () => {
    if (!resumeData.personalInfo.fullName || !jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and target job title.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)

    try {
      // Create a comprehensive prompt for Gemini
      const prompt = `Create a professional, ATS-optimized resume for ${resumeData.personalInfo.fullName} targeting a ${experienceLevel} ${jobTitle} position in the ${industry} industry${targetCompany ? ` at ${targetCompany}` : ''}.

Personal Information:
- Name: ${resumeData.personalInfo.fullName}
- Email: ${resumeData.personalInfo.email}
- Phone: ${resumeData.personalInfo.phone}
- Location: ${resumeData.personalInfo.location}
- LinkedIn: ${resumeData.personalInfo.linkedin}
- GitHub: ${resumeData.personalInfo.github}
- Portfolio: ${resumeData.personalInfo.portfolio}

Professional Summary: ${resumeData.summary}

Experience: ${resumeData.experience.map(exp => `${exp.title} at ${exp.content}`).join('; ')}

Education: ${resumeData.education.map(edu => `${edu.title} from ${edu.content}`).join('; ')}

Skills: ${resumeData.skills.join(', ')}

Certifications: ${resumeData.certifications.map(cert => `${cert.title} - ${cert.content}`).join('; ')}

Projects: ${resumeData.projects.map(proj => `${proj.title}: ${proj.content}`).join('; ')}

Languages: ${resumeData.languages.join(', ')}

Style Preference: ${resumeStyle}

Please create a professional resume that:
1. Is ATS-optimized with relevant keywords
2. Highlights achievements and quantifiable results
3. Uses action verbs and industry-specific terminology
4. Follows modern resume formatting standards
5. Is tailored for the ${jobTitle} role
6. Includes a compelling professional summary
7. Uses bullet points for experience and achievements
8. Is concise but comprehensive

Format the resume in clean, professional HTML that can be easily converted to PDF.`

      const response = await geminiChatService.sendMessage(prompt, `resume_${Date.now()}`)
      
      if (response.content) {
        setGeneratedResume(response.content)
        toast({
          title: "Resume Generated!",
          description: "Your AI-powered resume is ready. You can now copy, download, or further customize it.",
        })
      } else {
        throw new Error("Failed to generate resume content")
      }

    } catch (error) {
      console.error('Resume generation error:', error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedResume)
      toast({
        title: "Copied!",
        description: "Resume content copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try manually.",
        variant: "destructive"
      })
    }
  }

  const downloadResume = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedResume], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast({
      title: "Downloaded!",
      description: "Your resume has been downloaded as HTML.",
    })
  }

  const renderSection = (sectionType: keyof ResumeData, title: string, icon: React.ReactNode) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection(sectionType)}
            className="text-xs"
          >
            Add {title.slice(0, -1)}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {(resumeData[sectionType] as ResumeSection[]).map((section, index) => (
          <div key={section.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection(sectionType, section.id)}
                className="h-6 px-2"
              >
                {section.isExpanded ? "▼" : "▶"} {section.title || `New ${title.slice(0, -1)}`}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(sectionType, section.id)}
                className="h-6 px-2 text-red-500 hover:text-red-700"
              >
                ×
              </Button>
            </div>
            {section.isExpanded && (
              <div className="space-y-2">
                <Input
                  placeholder={`${title.slice(0, -1)} Title`}
                  value={section.title}
                  onChange={(e) => updateSection(sectionType, section.id, 'title', e.target.value)}
                />
                <Textarea
                  placeholder={`${title.slice(0, -1)} Details`}
                  value={section.content}
                  onChange={(e) => updateSection(sectionType, section.id, 'content', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}
        {(resumeData[sectionType] as ResumeSection[]).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No {title.toLowerCase()} added yet. Click "Add {title.slice(0, -1)}" to get started.
          </p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Resume Writer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional, ATS-optimized resumes with the power of Gemini AI. Get personalized content tailored to your target role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
    <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                AI Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Target Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
        </div>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry-level">Entry Level</SelectItem>
                      <SelectItem value="mid-level">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
      </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Technology, Healthcare"
                  />
              </div>
                <div>
                  <Label htmlFor="targetCompany">Target Company</Label>
                  <Input
                    id="targetCompany"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g., Google, Microsoft"
                  />
            </div>
        </div>

              <div>
                <Label htmlFor="resumeStyle">Resume Style</Label>
                <Select value={resumeStyle} onValueChange={setResumeStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Clean</SelectItem>
                    <SelectItem value="traditional">Traditional & Professional</SelectItem>
                    <SelectItem value="creative">Creative & Unique</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
      </div>

              <Button
                onClick={generateResumeWithAI}
                disabled={isGenerating || !jobTitle}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate with Gemini AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                    id="fullName"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo.fullName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                  <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
                    placeholder="john@example.com"
                    />
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo.location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.personalInfo.linkedin}
                    onChange={(e) => handleInputChange('personalInfo.linkedin', e.target.value)}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={resumeData.personalInfo.github}
                    onChange={(e) => handleInputChange('personalInfo.github', e.target.value)}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div>
                  <Label htmlFor="portfolio">Portfolio</Label>
                    <Input
                    id="portfolio"
                    value={resumeData.personalInfo.portfolio}
                    onChange={(e) => handleInputChange('personalInfo.portfolio', e.target.value)}
                    placeholder="johndoe.dev"
                    />
                  </div>
                            </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
                    <Textarea
                placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives..."
                      value={resumeData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                      rows={4}
                    />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
                        <Textarea
                placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js, Python, AWS)"
                value={resumeData.skills.join(', ')}
                onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                          rows={3}
                        />
            </CardContent>
                    </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
                    <Textarea
                placeholder="Enter languages you speak (e.g., English (Native), Spanish (Fluent), French (Intermediate))"
                value={resumeData.languages.join(', ')}
                onChange={(e) => setResumeData(prev => ({ ...prev, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      rows={2}
                    />
            </CardContent>
          </Card>

          {/* Dynamic Sections */}
          {renderSection('experience', 'Experience', <Briefcase className="w-5 h-5" />)}
          {renderSection('education', 'Education', <GraduationCap className="w-5 h-5" />)}
          {renderSection('certifications', 'Certifications', <Award className="w-5 h-5" />)}
          {renderSection('projects', 'Projects', <Users className="w-5 h-5" />)}
        </div>

        {/* Generated Resume Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generated Resume
                {generatedResume && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Powered by Gemini
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedResume ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadResume} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download HTML
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div 
                    className="prose prose-sm max-w-none border rounded-lg p-4 bg-muted/30"
                    dangerouslySetInnerHTML={{ __html: generatedResume }}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Ready to Generate Your Resume</p>
                  <p className="text-sm">
                    Fill out the form on the left and click "Generate with Gemini AI" to create your personalized, 
                    ATS-optimized resume powered by Gemini AI.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
