"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp,
  Brain,
  Target,
  ExternalLink,
  Filter as FilterIcon,
  Bookmark,
  Share2,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  XCircle,
  Linkedin
} from "lucide-react"

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  salary?: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote'
  experience: 'Entry' | 'Mid-level' | 'Senior' | 'Executive'
  postedDate: string
  applicationUrl: string
  skills: string[]
  industry: string
  benefits?: string[]
}

interface JobRecommendation {
  job: JobListing
  matchScore: number
  reasoning: string
  skillsMatched: string[]
  skillsMissing: string[]
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [experience, setExperience] = useState("all")
  const [jobType, setJobType] = useState("all")
  const [industry, setIndustry] = useState("all")
  const [userSkills, setUserSkills] = useState("")
  const [targetRole, setTargetRole] = useState("")

  const experienceLevels = [
    { value: "all", label: "All Experience Levels" },
    { value: "entry", label: "Entry Level" },
    { value: "mid-level", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive Level" }
  ]

  const jobTypes = [
    { value: "all", label: "All Job Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "remote", label: "Remote" }
  ]

  const industries = [
    { value: "all", label: "All Industries" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "consulting", label: "Consulting" }
  ]

  useEffect(() => {
    loadTrendingJobs()
  }, [])

  const loadTrendingJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs?trending=true')
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error('Error loading trending jobs:', error)
      toast.error('Failed to load trending jobs')
    } finally {
      setLoading(false)
    }
  }

  const searchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('query', searchQuery)
      if (location) params.append('location', location)
      if (experience !== 'all') params.append('experience', experience)
      if (jobType !== 'all') params.append('type', jobType)
      if (industry !== 'all') params.append('industry', industry)

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
        toast.success(`Found ${data.data.length} jobs matching your criteria`)
      } else {
        toast.error(data.error || 'Failed to search jobs')
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
      toast.error('Failed to search jobs')
    } finally {
      setLoading(false)
    }
  }

  const getJobRecommendations = async () => {
    if (!userSkills.trim() || !targetRole.trim()) {
      toast.error("Please enter your skills and target role")
      return
    }

    try {
      setLoading(true)
      const skillsArray = userSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userSkills: skillsArray,
          targetRole,
          experience: experience === 'all' ? 'mid-level' : experience,
          location
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.data)
        toast.success(`Found ${data.data.length} personalized job recommendations!`)
      } else {
        toast.error(data.error || 'Failed to get job recommendations')
      }
    } catch (error) {
      console.error('Error getting job recommendations:', error)
      toast.error('Failed to get job recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getExperienceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'entry': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'mid-level': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'senior': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'executive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'part-time': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'contract': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'remote': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">
              AI-Powered Job Recommendations
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover personalized job opportunities and career paths with our intelligent job matching system
          </p>
        </div>

        <Tabs defaultValue="trending" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Jobs
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Jobs
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Browse All
            </TabsTrigger>
          </TabsList>

          {/* Trending Jobs Tab */}
          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 animate-slide-in-up">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                          {job.company}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4">
                      {job.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getExperienceColor(job.experience)}>
                        {job.experience}
                      </Badge>
                      <Badge className={getJobTypeColor(job.type)}>
                        {job.type}
                      </Badge>
                      {job.salary && (
                        <Badge variant="outline" className="text-green-700 border-green-200">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(job.postedDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.skills.length} skills
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {job.industry}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="group-hover:bg-primary transition-colors"
                        onClick={() => window.open(job.applicationUrl, '_blank')}
                      >
                        {job.applicationUrl.includes('linkedin.com') ? (
                          <Linkedin className="w-4 h-4 mr-2" />
                        ) : (
                          <ExternalLink className="w-4 h-4 mr-2" />
                        )}
                        {job.applicationUrl.includes('linkedin.com') ? 'View on LinkedIn' : 'Apply Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Search Jobs Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Jobs
                </CardTitle>
                <CardDescription>
                  Enter job title or keywords to find relevant job opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Title or Keywords</label>
                    <Input
                      placeholder="e.g., Frontend Developer, Data Scientist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location (e.g., Bangalore, Mumbai)</label>
                    <Input
                      placeholder="e.g., Bangalore, Mumbai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={searchJobs} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Searching Jobs...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Jobs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Search Results */}
            {jobs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Search Results ({jobs.length} jobs)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <Card key={job.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="secondary" className="text-xs">
                              {job.company}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="line-clamp-3 mb-4">
                          {job.description}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getExperienceColor(job.experience)}>
                            {job.experience}
                          </Badge>
                          <Badge className={getJobTypeColor(job.type)}>
                            {job.type}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {job.industry}
                          </Badge>
                          <Button 
                            size="sm" 
                            className="group-hover:bg-primary transition-colors"
                            onClick={() => window.open(job.applicationUrl, '_blank')}
                          >
                            {job.applicationUrl.includes('linkedin.com') ? (
                              <Linkedin className="w-4 h-4 mr-2" />
                            ) : (
                              <ExternalLink className="w-4 h-4 mr-2" />
                            )}
                            {job.applicationUrl.includes('linkedin.com') ? 'View on LinkedIn' : 'Apply'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Get Personalized Job Recommendations
                </CardTitle>
                <CardDescription>
                  Enter your skills and target role to get AI-powered job recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Skills (comma-separated)</label>
                    <Input
                      placeholder="e.g., React, TypeScript, Node.js, Python"
                      value={userSkills}
                      onChange={(e) => setUserSkills(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Role</label>
                    <Input
                      placeholder="e.g., Frontend Developer, Data Scientist"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.slice(1).map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location (Optional)</label>
                    <Input
                      placeholder="e.g., San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={getJobRecommendations} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Get AI Job Recommendations
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Personalized Job Recommendations</h3>
                {recommendations.map((recommendation, index) => (
                  <Card key={index} className="animate-slide-in-up">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-primary" />
                          <CardTitle>{recommendation.job.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={recommendation.matchScore} className="w-20" />
                          <span className="text-sm text-muted-foreground">
                            {recommendation.matchScore}% match
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        {recommendation.job.company}
                        <MapPin className="w-4 h-4" />
                        {recommendation.job.location}
                      </div>
                      <CardDescription>{recommendation.reasoning}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Skills You Have ({recommendation.skillsMatched.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendation.skillsMatched.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            Skills to Develop ({recommendation.skillsMissing.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {recommendation.skillsMissing.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="border-red-200 text-red-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getExperienceColor(recommendation.job.experience)}>
                            {recommendation.job.experience}
                          </Badge>
                          <Badge className={getJobTypeColor(recommendation.job.type)}>
                            {recommendation.job.type}
                          </Badge>
                          {recommendation.job.salary && (
                            <Badge variant="outline" className="text-green-700 border-green-200">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {recommendation.job.salary}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          onClick={() => window.open(recommendation.job.applicationUrl, '_blank')}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {recommendation.job.applicationUrl.includes('linkedin.com') ? (
                            <Linkedin className="w-4 h-4 mr-2" />
                          ) : (
                            <ExternalLink className="w-4 h-4 mr-2" />
                          )}
                          {recommendation.job.applicationUrl.includes('linkedin.com') ? 'View on LinkedIn' : 'Apply Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Browse All Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 animate-slide-in-up">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                          {job.company}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4">
                      {job.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getExperienceColor(job.experience)}>
                        {job.experience}
                      </Badge>
                      <Badge className={getJobTypeColor(job.type)}>
                        {job.type}
                      </Badge>
                      {job.salary && (
                        <Badge variant="outline" className="text-green-700 border-green-200">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {job.industry}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="group-hover:bg-primary transition-colors"
                        onClick={() => window.open(job.applicationUrl, '_blank')}
                      >
                        {job.applicationUrl.includes('linkedin.com') ? (
                          <Linkedin className="w-4 h-4 mr-2" />
                        ) : (
                          <ExternalLink className="w-4 h-4 mr-2" />
                        )}
                        {job.applicationUrl.includes('linkedin.com') ? 'View on LinkedIn' : 'Apply Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {jobs.length === 0 && (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try searching for jobs or getting AI recommendations to find opportunities
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
