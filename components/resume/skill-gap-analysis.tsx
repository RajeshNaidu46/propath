"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target } from "lucide-react"

interface SkillGap {
  skill: string
  required: boolean
  proficiency: number
  gap: number
  priority: 'high' | 'medium' | 'low'
  recommendation: string
}

interface RoleSkills {
  role: string
  requiredSkills: string[]
  preferredSkills: string[]
  experience: string
  salary: string
  growth: string
}

export const jobRoles: RoleSkills[] = [
  {
    role: "Frontend Developer",
    requiredSkills: ["JavaScript", "React", "HTML", "CSS", "Git", "Responsive Design"],
    preferredSkills: ["TypeScript", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "Redux"],
    experience: "2-5 years",
    salary: "$70k - $120k",
    growth: "High demand"
  },
  {
    role: "Backend Developer",
    requiredSkills: ["Python", "Node.js", "SQL", "REST APIs", "Git", "Database Design"],
    preferredSkills: ["Java", "Go", "Docker", "AWS", "Microservices", "GraphQL"],
    experience: "3-6 years",
    salary: "$80k - $140k",
    growth: "Strong growth"
  },
  {
    role: "Full Stack Developer",
    requiredSkills: ["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"],
    preferredSkills: ["TypeScript", "Next.js", "Python", "Docker", "AWS", "GraphQL"],
    experience: "3-7 years",
    salary: "$90k - $150k",
    growth: "Very high demand"
  },
  {
    role: "Data Scientist",
    requiredSkills: ["Python", "SQL", "Statistics", "Machine Learning", "Data Analysis", "Pandas"],
    preferredSkills: ["R", "TensorFlow", "PyTorch", "AWS", "Docker", "Deep Learning"],
    experience: "2-5 years",
    salary: "$85k - $130k",
    growth: "Rapid growth"
  },
  {
    role: "DevOps Engineer",
    requiredSkills: ["Linux", "Docker", "AWS", "CI/CD", "Git", "Shell Scripting"],
    preferredSkills: ["Kubernetes", "Terraform", "Python", "Monitoring", "Security", "Ansible"],
    experience: "3-6 years",
    salary: "$90k - $140k",
    growth: "High demand"
  },
  {
    role: "Product Manager",
    requiredSkills: ["Product Strategy", "User Research", "Agile", "Data Analysis", "Communication", "Roadmapping"],
    preferredSkills: ["SQL", "A/B Testing", "Design Thinking", "Market Research", "Technical Background", "Leadership"],
    experience: "4-8 years",
    salary: "$100k - $160k",
    growth: "Strong growth"
  },
  {
    role: "Data Engineer",
    requiredSkills: ["Python", "SQL", "ETL", "Data Warehousing", "Airflow", "Spark"],
    preferredSkills: ["Kafka", "dbt", "AWS Glue", "Redshift", "Snowflake", "GCP BigQuery"],
    experience: "3-6 years",
    salary: "$95k - $150k",
    growth: "High demand"
  },
  {
    role: "Machine Learning Engineer",
    requiredSkills: ["Python", "ML Ops", "TensorFlow", "PyTorch", "Model Serving", "Docker"],
    preferredSkills: ["Kubernetes", "Kubeflow", "Feature Stores", "AWS SageMaker", "GCP Vertex AI", "Monitoring"],
    experience: "3-6 years",
    salary: "$110k - $170k",
    growth: "Rapid growth"
  },
  {
    role: "AI Engineer",
    requiredSkills: ["Python", "LLMs", "Prompt Engineering", "Vector DBs", "APIs", "Deployments"],
    preferredSkills: ["LangChain", "RAG", "OpenAI/Gemini APIs", "Embeddings", "Pinecone", "Weaviate"],
    experience: "2-5 years",
    salary: "$110k - $180k",
    growth: "Explosive growth"
  },
  {
    role: "Cloud Engineer",
    requiredSkills: ["AWS", "Networking", "Linux", "Terraform", "IAM", "Monitoring"],
    preferredSkills: ["Azure", "GCP", "Ansible", "CloudFormation", "CDK", "Cost Optimization"],
    experience: "3-6 years",
    salary: "$100k - $160k",
    growth: "High demand"
  },
  {
    role: "Cloud Architect",
    requiredSkills: ["AWS", "Architecture", "Security", "Networking", "Databases", "Scalability"],
    preferredSkills: ["Azure", "GCP", "Kubernetes", "Event-Driven", "Microservices", "DR/BCP"],
    experience: "6-10 years",
    salary: "$140k - $200k",
    growth: "High demand"
  },
  {
    role: "Site Reliability Engineer (SRE)",
    requiredSkills: ["Linux", "Monitoring", "Incident Response", "SLO/SLA", "Automation", "Python"],
    preferredSkills: ["Kubernetes", "Prometheus", "Grafana", "Chaos Engineering", "CI/CD", "On-call"],
    experience: "3-6 years",
    salary: "$110k - $170k",
    growth: "High demand"
  },
  {
    role: "Cybersecurity Engineer",
    requiredSkills: ["Security", "Networking", "Threat Modeling", "Vulnerability Mgmt", "SIEM", "IAM"],
    preferredSkills: ["Incident Response", "Cloud Security", "Pentesting", "Zero Trust", "Compliance", "DevSecOps"],
    experience: "3-7 years",
    salary: "$110k - $170k",
    growth: "High demand"
  },
  {
    role: "SOC Analyst",
    requiredSkills: ["SIEM", "Log Analysis", "Incident Response", "Networking", "Linux", "Threat Intel"],
    preferredSkills: ["Splunk", "QRadar", "EDR", "Forensics", "Scripting", "Cloud Logs"],
    experience: "1-4 years",
    salary: "$70k - $110k",
    growth: "Strong growth"
  },
  {
    role: "Penetration Tester",
    requiredSkills: ["Pentesting", "Burp Suite", "OWASP", "Scripting", "Networking", "Linux"],
    preferredSkills: ["Cloud Pentest", "Mobile Pentest", "Exploit Dev", "Reporting", "Red Team"],
    experience: "2-5 years",
    salary: "$90k - $140k",
    growth: "Strong growth"
  },
  {
    role: "Mobile Developer (iOS)",
    requiredSkills: ["Swift", "iOS SDK", "UIKit/SwiftUI", "REST APIs", "Xcode", "Git"],
    preferredSkills: ["Objective-C", "Core Data", "Combine", "Fastlane", "CI/CD", "Firebase"],
    experience: "2-5 years",
    salary: "$90k - $150k",
    growth: "High demand"
  },
  {
    role: "Mobile Developer (Android)",
    requiredSkills: ["Kotlin", "Android SDK", "Jetpack", "REST APIs", "Gradle", "Git"],
    preferredSkills: ["Java", "Room", "Hilt/Dagger", "Coroutines", "Compose", "Firebase"],
    experience: "2-5 years",
    salary: "$90k - $150k",
    growth: "High demand"
  },
  {
    role: "React Native Developer",
    requiredSkills: ["JavaScript", "React Native", "Mobile UI", "REST APIs", "Git", "Debugging"],
    preferredSkills: ["TypeScript", "Native Modules", "CI/CD", "App Store/Play", "Redux", "Testing"],
    experience: "2-5 years",
    salary: "$85k - $140k",
    growth: "High demand"
  },
  {
    role: "Flutter Developer",
    requiredSkills: ["Dart", "Flutter", "State Mgmt", "REST APIs", "Git", "UI/UX"],
    preferredSkills: ["BLoC/Provider", "Firebase", "CI/CD", "Animations", "Platform Channels"],
    experience: "1-4 years",
    salary: "$80k - $130k",
    growth: "Strong growth"
  },
  {
    role: "QA Engineer",
    requiredSkills: ["Test Cases", "Automation", "Selenium", "API Testing", "Bug Tracking", "CI"],
    preferredSkills: ["Cypress", "Playwright", "Performance", "Security Testing", "Mobile Testing"],
    experience: "2-5 years",
    salary: "$70k - $120k",
    growth: "Stable demand"
  },
  {
    role: "Automation Test Engineer",
    requiredSkills: ["JavaScript/Java", "Selenium/Cypress", "Test Frameworks", "CI/CD", "API Testing", "Git"],
    preferredSkills: ["Playwright", "BDD", "Docker", "Reporting", "Cloud Grids"],
    experience: "2-5 years",
    salary: "$80k - $130k",
    growth: "Strong growth"
  },
  {
    role: "Platform Engineer",
    requiredSkills: ["Kubernetes", "CI/CD", "IaC", "Observability", "SRE", "Cloud"],
    preferredSkills: ["Service Mesh", "GitOps", "ArgoCD", "Helm", "Security"],
    experience: "3-7 years",
    salary: "$120k - $180k",
    growth: "High demand"
  },
  {
    role: "Blockchain Developer",
    requiredSkills: ["Solidity", "Smart Contracts", "Web3", "Ethereum", "Security", "Testing"],
    preferredSkills: ["Rust", "Move", "DeFi", "Oracles", "L2s", "Auditing"],
    experience: "2-5 years",
    salary: "$110k - $180k",
    growth: "Variable demand"
  },
  {
    role: "NLP Engineer",
    requiredSkills: ["Python", "NLP", "Transformers", "Tokenization", "Evaluation", "Vector Search"],
    preferredSkills: ["LLMs", "RAG", "Fine-tuning", "OpenAI/Gemini", "Streaming"],
    experience: "2-5 years",
    salary: "$110k - $170k",
    growth: "High demand"
  },
  {
    role: "Computer Vision Engineer",
    requiredSkills: ["Python", "OpenCV", "Deep Learning", "PyTorch", "Detection/Segmentation", "Deployment"],
    preferredSkills: ["TensorRT", "ONNX", "Edge AI", "CUDA", "MLOps"],
    experience: "2-5 years",
    salary: "$110k - $170k",
    growth: "Strong growth"
  },
  {
    role: "Solutions Architect",
    requiredSkills: ["Architecture", "Cloud", "Security", "Databases", "Integration", "Stakeholders"],
    preferredSkills: ["AWS SA Pro", "Azure Architect", "GCP Architect", "Costing", "Migration"],
    experience: "6-10 years",
    salary: "$140k - $200k",
    growth: "High demand"
  },
  {
    role: "Business Analyst",
    requiredSkills: ["Requirements", "Stakeholder Mgmt", "Process Mapping", "Documentation", "SQL", "Reporting"],
    preferredSkills: ["Agile", "Jira", "Confluence", "UML", "BI Tools"],
    experience: "2-5 years",
    salary: "$70k - $120k",
    growth: "Stable demand"
  },
  {
    role: "Technical Program Manager",
    requiredSkills: ["Program Mgmt", "Roadmaps", "Risk Mgmt", "Communication", "Agile", "Metrics"],
    preferredSkills: ["Cloud", "Architecture", "Security", "Finance", "Change Mgmt"],
    experience: "6-10 years",
    salary: "$130k - $200k",
    growth: "High demand"
  },
  {
    role: "Salesforce Developer",
    requiredSkills: ["Apex", "LWC", "Salesforce Admin", "APIs", "Integrations", "SOQL"],
    preferredSkills: ["DevOps Center", "CI/CD", "Security", "Flows", "Packaging"],
    experience: "2-5 years",
    salary: "$90k - $150k",
    growth: "High demand"
  },
  {
    role: "ServiceNow Developer",
    requiredSkills: ["ServiceNow", "Scripting", "Workflows", "Catalog", "Integrations", "CMDB"],
    preferredSkills: ["ITSM", "ITOM", "SecOps", "App Engine", "Flows"],
    experience: "2-5 years",
    salary: "$90k - $150k",
    growth: "High demand"
  },
  {
    role: "Analytics Engineer",
    requiredSkills: ["SQL", "dbt", "Data Modeling", "ETL", "Version Control", "Testing"],
    preferredSkills: ["Python", "Airflow", "Snowflake", "BigQuery", "Looker/Power BI"],
    experience: "2-5 years",
    salary: "$95k - $150k",
    growth: "High demand"
  }
]

export function SkillGapAnalysis({ initialRole = "", initialSkills = [], autoAnalyze = false }: { initialRole?: string; initialSkills?: string[]; autoAnalyze?: boolean }) {
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [userSkills, setUserSkills] = useState<string[]>(initialSkills)
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)

  // Initialize from props and optionally auto-run analysis
  useEffect(() => {
    let changed = false
    if (initialRole && initialRole !== selectedRole) {
      setSelectedRole(initialRole)
      changed = true
    }
    if (initialSkills.length > 0) {
      setUserSkills(Array.from(new Set([...initialSkills])))
      changed = true
    }
    if (autoAnalyze && (changed || skillGaps.length === 0) && (initialRole || selectedRole) && (initialSkills.length > 0 || userSkills.length > 0)) {
      setTimeout(() => analyzeGaps(), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRole, initialSkills.length, autoAnalyze])

  const commonSkills = [
    "JavaScript", "Python", "React", "Node.js", "SQL", "Git", "HTML", "CSS",
    "TypeScript", "Java", "C++", "Go", "Rust", "PHP", "Ruby", "Swift",
    "Vue.js", "Angular", "Next.js", "Express.js", "Django", "Flask", "Spring",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
    "Azure", "GCP", "Linux", "Shell Scripting", "REST APIs", "GraphQL",
    "Microservices", "CI/CD", "Agile", "Scrum", "Product Strategy", "User Research",
    "Data Analysis", "Machine Learning", "Statistics", "Pandas", "NumPy",
    "TensorFlow", "PyTorch", "Scikit-learn", "Tableau", "Power BI", "Excel"
  ]

  const addSkill = (skill: string) => {
    if (!userSkills.includes(skill)) {
      setUserSkills([...userSkills, skill])
    }
  }

  const removeSkill = (skill: string) => {
    setUserSkills(userSkills.filter(s => s !== skill))
  }

  const analyzeGaps = () => {
    if (!selectedRole || userSkills.length === 0) {
      return
    }

    const role = jobRoles.find(r => r.role === selectedRole)
    if (!role) return

    const allRequiredSkills = [...role.requiredSkills, ...role.preferredSkills]
    const gaps: SkillGap[] = []

    allRequiredSkills.forEach(skill => {
      const hasSkill = userSkills.includes(skill)
      const isRequired = role.requiredSkills.includes(skill)
      const proficiency = hasSkill ? 85 : 0
      const gap = hasSkill ? 0 : 100
      
      let priority: 'high' | 'medium' | 'low' = 'low'
      if (isRequired && !hasSkill) priority = 'high'
      else if (role.preferredSkills.includes(skill) && !hasSkill) priority = 'medium'

      let recommendation = ""
      if (!hasSkill) {
        if (isRequired) {
          recommendation = `Essential skill for ${selectedRole}. Consider taking online courses or building projects.`
        } else {
          recommendation = `Preferred skill that can give you an edge. Learn through tutorials and practice.`
        }
      } else {
        recommendation = "Great! Continue improving this skill through advanced projects."
      }

      gaps.push({
        skill,
        required: isRequired,
        proficiency,
        gap,
        priority,
        recommendation
      })
    })

    setSkillGaps(gaps)
    setAnalysisComplete(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <XCircle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return null
    }
  }

  const selectedRoleData = jobRoles.find(r => r.role === selectedRole)

  return (
    <div className="space-y-6 fade-in">
      {/* Role Selection */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Select Target Role
          </CardTitle>
          <CardDescription>
            Choose the role you're targeting to analyze skill gaps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a job role" />
            </SelectTrigger>
            <SelectContent>
              {jobRoles.map((role) => (
                <SelectItem key={role.role} value={role.role}>
                  {role.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRoleData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">{selectedRoleData.role}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Experience:</span> {selectedRoleData.experience}
                </div>
                <div>
                  <span className="font-medium">Salary Range:</span> {selectedRoleData.salary}
                </div>
                <div>
                  <span className="font-medium">Market Growth:</span> {selectedRoleData.growth}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Selection */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle>Your Skills</CardTitle>
          <CardDescription>
            Select all the skills you have experience with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Add Your Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(skill)}
                  disabled={userSkills.includes(skill)}
                  className="text-xs"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={analyzeGaps} 
            disabled={!selectedRole || userSkills.length === 0}
            className="w-full premium-button"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyze Skill Gaps
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisComplete && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {skillGaps.filter(g => g.proficiency > 0).length}
                  </div>
                  <div className="text-sm text-green-700">Skills You Have</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {skillGaps.filter(g => g.gap > 0 && g.required).length}
                  </div>
                  <div className="text-sm text-red-700">Critical Gaps</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((skillGaps.filter(g => g.proficiency > 0).length / skillGaps.length) * 100)}%
                  </div>
                  <div className="text-sm text-blue-700">Match Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Detailed Skill Analysis</CardTitle>
              <CardDescription>
                Skills required for {selectedRole} with your current proficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGaps.map((gap) => (
                <div key={gap.skill} className="border rounded-lg p-4 slide-in-left">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{gap.skill}</h4>
                      {gap.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      <Badge className={`text-xs ${getPriorityColor(gap.priority)}`}>
                        {getPriorityIcon(gap.priority)}
                        <span className="ml-1 capitalize">{gap.priority} priority</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{gap.proficiency}%</div>
                      <div className="text-xs text-gray-500">Proficiency</div>
                    </div>
                  </div>
                  
                  <Progress value={gap.proficiency} className="mb-3" />
                  
                  <p className="text-sm text-gray-600">{gap.recommendation}</p>
                  
                  {gap.gap > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-1">Learning Recommendations:</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Take online courses on platforms like Coursera, Udemy, or freeCodeCamp</li>
                        <li>• Build projects using this skill to gain practical experience</li>
                        <li>• Join communities and forums to learn from others</li>
                        <li>• Consider certifications to validate your knowledge</li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Recommended Action Plan</CardTitle>
              <CardDescription>
                Prioritized steps to close your skill gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps
                  .filter(gap => gap.gap > 0)
                  .sort((a, b) => {
                    if (a.required && !b.required) return -1
                    if (!a.required && b.required) return 1
                    return a.priority === 'high' ? -1 : 1
                  })
                  .slice(0, 5)
                  .map((gap, index) => (
                    <div key={gap.skill} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{gap.skill}</h4>
                        <p className="text-sm text-gray-600 mt-1">{gap.recommendation}</p>
                        <div className="mt-2">
                          <Badge className={`text-xs ${getPriorityColor(gap.priority)}`}>
                            {gap.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
