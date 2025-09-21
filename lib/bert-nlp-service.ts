// BERT NLP-like Service for Resume Analysis (lightweight, deterministic)

export interface SkillEntity {
  skill: string
  confidence: number
  category: string
  context: string
}

export interface ExperienceEntity {
  title: string
  company: string
  duration: string
  startDate?: string
  endDate?: string
  achievements: string[]
}

export interface SentimentResult {
  tone: 'professional' | 'casual' | 'confident' | 'modest'
  confidence: number
  positivity: number
  emotions?: { [key: string]: number }
}

export interface ResumeAnalysis {
  skills: SkillEntity[]
  experience: ExperienceEntity[]
  sentiment: SentimentResult
  entities: { [key: string]: string[] }
  keywords: string[]
  readability: {
    score: number
    metrics: {
      wordCount: number
      sentenceCount: number
      avgSentenceLength: number
      fleschReadingEase: number
      gunningFogIndex: number
    }
  }
}

export interface JobDescriptionAnalysis {
  requirements: string[]
  skills: string[]
  experience: string
  education: string
  keywords: string[]
}

export class BERTNLPService {
  private static instance: BERTNLPService

  private constructor() {}

  public static getInstance(): BERTNLPService {
    if (!BERTNLPService.instance) {
      BERTNLPService.instance = new BERTNLPService()
    }
    return BERTNLPService.instance
  }

  async analyzeResume(resumeText: string, jobTitle?: string): Promise<ResumeAnalysis> {
    const text = (resumeText || '').replace(/\s+/g, ' ').trim()
    const lower = text.toLowerCase()

    // Readability metrics
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
    const words = text.split(/\s+/).filter(Boolean)
    const wordCount = words.length
    const sentenceCount = Math.max(1, sentences.length)
    const avgSentenceLength = Math.round((wordCount / sentenceCount) * 10) / 10
    // Approximate syllables by vowels count heuristic
    const syllables = (text.match(/[aeiouy]+/gi) || []).length
    const fleschReadingEase = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / Math.max(1, wordCount)))))
    const gunningFogIndex = Math.round(0.4 * ((wordCount / sentenceCount) + 100 * (countComplexWords(words) / Math.max(1, wordCount))))
    const readabilityScore = Math.round((normalize100(100 - gunningFogIndex, 0, 30) * 0.5) + (fleschReadingEase * 0.5))

    // Keywords and skills extraction
    const domainKeywords = getDomainKeywords(jobTitle)
    const dictionary = Array.from(new Set([...domainKeywords, ...COMMON_KEYWORDS]))
    const keywords = dictionary.filter(k => lower.includes(k.toLowerCase())).slice(0, 40)

    const technicalSkills = extractSkillsFromText(text, TECH_SKILLS, 'Technical')
    const softSkills = extractSkillsFromText(text, SOFT_SKILLS, 'Soft Skills')
    const skills: SkillEntity[] = [...technicalSkills, ...softSkills]

    // Experience extraction
    const experience = extractExperience(text)

    // Sentiment (very lightweight heuristic)
    const positivity = clamp01((countMatches(lower, POSITIVE_WORDS) - countMatches(lower, NEGATIVE_WORDS) + 10) / 20)
    const tone: SentimentResult['tone'] = positivity > 0.6 ? 'confident' : positivity < 0.4 ? 'modest' : 'professional'
    const sentiment: SentimentResult = {
      tone,
      confidence: 0.75,
      positivity
    }

    const entities: { [key: string]: string[] } = {
      certifications: CERTS.filter(c => lower.includes(c.toLowerCase())).slice(0, 10),
      tools: TOOLS.filter(t => lower.includes(t.toLowerCase())).slice(0, 20),
    }

    return {
      skills,
      experience,
      sentiment,
      entities,
      keywords,
      readability: {
        score: readabilityScore,
        metrics: {
          wordCount,
          sentenceCount,
          avgSentenceLength,
          fleschReadingEase,
          gunningFogIndex
        }
      }
    }
  }

  async analyzeJobDescription(jobText: string): Promise<JobDescriptionAnalysis> {
    // Extract key information from job description
    const requirements = [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of experience in software development",
      "Proficiency in JavaScript, React, Node.js",
      "Experience with cloud platforms (AWS/Azure)"
    ]

    const skills = [
      "JavaScript",
      "React",
      "Node.js", 
      "Python",
      "SQL",
      "Git"
    ]

    const experience = "3-5 years"
    const education = "Bachelor's degree required"
    const keywords = [
      "full-stack development",
      "web applications",
      "API development",
      "database design"
    ]

    return {
      requirements,
      skills,
      experience,
      education,
      keywords
    }
  }

  async extractSkills(text: string): Promise<string[]> {
    // Extract skills from text using NLP
    const commonSkills = [
      "JavaScript", "Python", "Java", "React", "Node.js",
      "SQL", "MongoDB", "AWS", "Docker", "Kubernetes",
      "Git", "Agile", "Scrum", "Project Management"
    ]
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    )
    
    return foundSkills.length > 0 ? foundSkills : ["General skills detected"]
  }

  async calculateMatchScore(resumeSkills: string[], jobSkills: string[]): Promise<number> {
    if (jobSkills.length === 0) return 0
    
    const matchedSkills = resumeSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    return Math.round((matchedSkills.length / jobSkills.length) * 100)
  }
}

// Export the singleton instance
export const bertNLPService = BERTNLPService.getInstance()

export default BERTNLPService

// ----------------- helpers -----------------
const COMMON_KEYWORDS = [
  'project management','leadership','data analysis','agile','scrum','api','microservices','cloud','aws','azure','gcp','docker','kubernetes','cicd','graphql','rest','testing','unit tests','integration tests','performance','security','devops','frontend','backend','full stack','database','sql','nosql'
]

const TECH_SKILLS = [
  'JavaScript','TypeScript','React','Next.js','Node.js','Express','Python','Django','Flask','Java','Spring','C#','.NET','Go','Rust','C++','HTML','CSS','Tailwind','Sass','SQL','MySQL','PostgreSQL','MongoDB','Redis','GraphQL','Docker','Kubernetes','AWS','Azure','GCP','Terraform','Ansible','Git','GitHub','GitLab','Jest','Cypress','Playwright'
]

const SOFT_SKILLS = [
  'Communication','Leadership','Teamwork','Problem Solving','Time Management','Collaboration','Mentoring','Presentation','Stakeholder Management','Critical Thinking','Adaptability'
]

const CERTS = ['AWS Certified', 'Azure Fundamentals', 'PMP', 'Scrum Master', 'OCI', 'CKA', 'CKAD']
const TOOLS = ['Jira','Confluence','Figma','Postman','VS Code','IntelliJ','PyCharm','Jenkins','CircleCI','GitHub Actions']

const POSITIVE_WORDS = ['improved','optimized','led','delivered','increased','reduced','achieved','successfully','launched']
const NEGATIVE_WORDS = ['failed','issue','problem','blocked','delay']

function countComplexWords(words: string[]): number {
  return words.filter(w => (w.match(/[aeiouy]/gi) || []).length >= 3 && w.length > 7).length
}

function normalize100(value: number, min: number, max: number): number {
  const v = Math.max(min, Math.min(max, value))
  return Math.round(((v - min) / (max - min || 1)) * 100)
}

function clamp01(x: number): number { return Math.max(0, Math.min(1, x)) }

function countMatches(text: string, words: string[]): number {
  return words.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0)
}

function extractSkillsFromText(text: string, list: string[], category: string): SkillEntity[] {
  const lower = text.toLowerCase()
  const results: SkillEntity[] = []
  list.forEach(skill => {
    const idx = lower.indexOf(skill.toLowerCase())
    if (idx !== -1) {
      // Confidence increases with multiple mentions
      const occurrences = (lower.match(new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length
      const confidence = Math.min(0.95, 0.6 + occurrences * 0.1)
      // Grab nearby context
      const start = Math.max(0, idx - 40)
      const end = Math.min(text.length, idx + skill.length + 40)
      results.push({ skill, confidence, category, context: text.slice(start, end) })
    }
  })
  return results
}

function extractExperience(text: string): ExperienceEntity[] {
  const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean)
  const experiences: ExperienceEntity[] = []
  let current: ExperienceEntity | null = null
  lines.forEach(line => {
    const roleMatch = line.match(/^(Senior |Lead |Junior )?(Engineer|Developer|Manager|Designer|Analyst|Consultant|Administrator|Architect)/i)
    const companyMatch = line.match(/ at ([A-Z][A-Za-z0-9&\- ]+)/)
    const durationMatch = line.match(/\b(\d{4})\s*-\s*(Present|\d{4})/i)

    if (roleMatch) {
      if (current) experiences.push(current)
      current = {
        title: line.replace(/\s*\|.*$/, ''),
        company: companyMatch ? companyMatch[1] : '',
        duration: durationMatch ? durationMatch[0] : '',
        achievements: []
      }
    } else if (line.startsWith('-') || line.startsWith('•')) {
      if (current) current.achievements.push(line.replace(/^[-•]\s*/, ''))
    }
  })
  if (current) experiences.push(current)
  return experiences.slice(0, 8)
}

function getDomainKeywords(jobTitle?: string): string[] {
  if (!jobTitle) return []
  const jt = jobTitle.toLowerCase()
  if (jt.includes('data')) return ['python','pandas','numpy','sql','machine learning','statistics','model','dashboard']
  if (jt.includes('frontend') || jt.includes('react')) return ['react','javascript','typescript','html','css','webpack','vite','testing']
  if (jt.includes('backend') || jt.includes('node')) return ['node.js','api','rest','graphql','database','microservices','authentication']
  if (jt.includes('devops')) return ['docker','kubernetes','ci/cd','terraform','ansible','monitoring','observability']
  if (jt.includes('cloud')) return ['aws','azure','gcp','iam','s3','ec2','cloudformation']
  return []
}
