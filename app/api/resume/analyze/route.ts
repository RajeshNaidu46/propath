import { NextRequest, NextResponse } from 'next/server'
import { bertNLPService } from '@/lib/bert-nlp-service'

interface ResumeAnalysisRequest {
  content: string
  jobTitle?: string
  industry?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ResumeAnalysisRequest = await request.json()
    
    if (!body.content) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      )
    }

    console.log('Starting real BERT/NLP analysis...')
    const startTime = Date.now()

    // Perform real BERT/NLP analysis
    const bertAnalysis = await bertNLPService.analyzeResume(body.content, body.jobTitle)
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(1)

    // Transform BERT analysis to match our expected format
    const analysis = {
      overallScore: Math.round(
        (bertAnalysis.readability.score + 
         bertAnalysis.sentiment.confidence * 100 + 
         (bertAnalysis.skills.length / 20) * 100) / 3
      ),
      atsOptimization: {
        score: Math.round(
          (bertAnalysis.keywords.length / 15) * 40 + 
          (bertAnalysis.skills.length / 20) * 40 + 
          (bertAnalysis.readability.score / 100) * 20
        ),
        issues: generateATSIssues(bertAnalysis),
        suggestions: generateATSSuggestions(bertAnalysis),
        keywords: bertAnalysis.keywords,
        missingKeywords: findMissingKeywords(bertAnalysis, body.jobTitle)
      },
      contentAnalysis: {
        readability: bertAnalysis.readability.score,
        wordCount: bertAnalysis.readability.metrics.wordCount,
        sentenceCount: bertAnalysis.readability.metrics.sentenceCount,
        avgSentenceLength: bertAnalysis.readability.metrics.avgSentenceLength,
        actionVerbs: extractActionVerbs(body.content),
        weakWords: extractWeakWords(body.content)
      },
      skillExtraction: {
        technicalSkills: bertAnalysis.skills
          .filter(skill => skill.category !== 'Soft Skills')
          .map(skill => skill.skill),
        softSkills: bertAnalysis.skills
          .filter(skill => skill.category === 'Soft Skills')
          .map(skill => skill.skill),
        skillConfidence: Object.fromEntries(
          bertAnalysis.skills.map(skill => [skill.skill, skill.confidence])
        ),
        skillCategories: categorizeSkills(bertAnalysis.skills)
      },
      experienceAnalysis: {
        yearsOfExperience: calculateYearsOfExperience(bertAnalysis.experience),
        roleProgression: bertAnalysis.experience.map(exp => `${exp.title} → ${exp.company}`),
        achievements: bertAnalysis.experience.flatMap(exp => exp.achievements),
        impactMetrics: extractImpactMetrics(body.content)
      },
      sentimentAnalysis: {
        tone: bertAnalysis.sentiment.tone,
        confidence: bertAnalysis.sentiment.confidence,
        positivity: bertAnalysis.sentiment.positivity
      },
      recommendations: generateRecommendations(bertAnalysis, body.content)
    }

    return NextResponse.json({
      success: true,
      analysis,
      processingTime: `${processingTime}s`,
      model: 'BERT-base-uncased + RoBERTa + Custom NLP Pipeline',
      bertAnalysis: bertAnalysis // Include raw BERT analysis for debugging
    })

  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume with BERT/NLP' },
      { status: 500 }
    )
  }
}

// Helper functions to transform BERT analysis
function generateATSIssues(bertAnalysis: any): string[] {
  const issues = []
  
  if (bertAnalysis.keywords.length < 8) {
    issues.push("Missing industry-specific keywords")
  }
  
  if (bertAnalysis.readability.score < 70) {
    issues.push("Content readability needs improvement")
  }
  
  if (bertAnalysis.skills.length < 10) {
    issues.push("Insufficient skill keywords detected")
  }
  
  if (bertAnalysis.sentiment.confidence < 0.7) {
    issues.push("Writing tone could be more professional")
  }
  
  return issues
}

function generateATSSuggestions(bertAnalysis: any): string[] {
  const suggestions = []
  
  if (bertAnalysis.keywords.length < 8) {
    suggestions.push("Add more industry-specific keywords to improve ATS matching")
  }
  
  if (bertAnalysis.readability.score < 70) {
    suggestions.push("Simplify sentence structure for better readability")
  }
  
  if (bertAnalysis.skills.length < 10) {
    suggestions.push("Include more technical and soft skills")
  }
  
  if (bertAnalysis.sentiment.confidence < 0.7) {
    suggestions.push("Use more confident and professional language")
  }
  
  return suggestions
}

function findMissingKeywords(bertAnalysis: any, jobTitle?: string): string[] {
  const commonKeywords = [
    'React.js', 'Node.js', 'Docker', 'AWS', 'TypeScript', 'Kubernetes',
    'Microservices', 'CI/CD', 'GraphQL', 'Redux', 'Vue.js', 'Angular',
    'Python', 'Java', 'SQL', 'Git', 'Agile', 'Scrum'
  ]
  
  const existingKeywords = bertAnalysis.keywords.map((k: string) => k.toLowerCase())
  
  return commonKeywords
    .filter(keyword => !existingKeywords.includes(keyword.toLowerCase()))
    .slice(0, 5)
}

function extractActionVerbs(content: string): string[] {
  const actionVerbs = [
    'Developed', 'Implemented', 'Led', 'Managed', 'Optimized', 'Designed',
    'Created', 'Built', 'Deployed', 'Maintained', 'Improved', 'Enhanced',
    'Coordinated', 'Collaborated', 'Mentored', 'Trained', 'Analyzed', 'Resolved'
  ]
  
  return actionVerbs.filter(verb => content.includes(verb)).slice(0, 6)
}

function extractWeakWords(content: string): string[] {
  const weakWords = [
    'Helped', 'Assisted', 'Tried', 'Attempted', 'Maybe', 'Hopefully',
    'Kind of', 'Sort of', 'Basically', 'Actually', 'Literally'
  ]
  
  return weakWords.filter(word => content.toLowerCase().includes(word.toLowerCase()))
}

function categorizeSkills(skills: any[]): { [key: string]: string[] } {
  const categories: { [key: string]: string[] } = {}
  
  skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = []
    }
    categories[skill.category].push(skill.skill)
  })
  
  return categories
}

function calculateYearsOfExperience(experience: any[]): number {
  // Simple calculation based on number of experiences
  // In a real implementation, you'd parse dates and calculate actual years
  return Math.min(experience.length * 1.5, 10)
}

function extractImpactMetrics(content: string): string[] {
  const metrics: string[] = []
  const percentagePattern = /(\d+%)/g
  const numberPattern = /(\d+)\s*(?:users?|customers?|projects?|applications?)/gi
  
  let match
  while ((match = percentagePattern.exec(content)) !== null) {
    metrics.push(match[1])
  }
  
  while ((match = numberPattern.exec(content)) !== null) {
    metrics.push(`${match[1]} ${match[2]}`)
  }
  
  return metrics.slice(0, 5)
}

function generateRecommendations(bertAnalysis: any, content: string): any[] {
  const recommendations = []
  
  if (bertAnalysis.keywords.length < 8) {
    recommendations.push({
      priority: 'high' as const,
      category: 'ATS Optimization',
      suggestion: 'Add more industry-specific keywords to improve ATS matching',
      impact: 'High - Will improve ATS matching by 15-20%'
    })
  }
  
  if (bertAnalysis.readability.score < 70) {
    recommendations.push({
      priority: 'high' as const,
      category: 'Content',
      suggestion: 'Improve readability by simplifying sentence structure',
      impact: 'Medium - Will make resume easier to read'
    })
  }
  
  if (bertAnalysis.sentiment.confidence < 0.7) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Tone',
      suggestion: 'Use more confident and professional language',
      impact: 'Medium - Will improve perceived confidence'
    })
  }
  
  if (bertAnalysis.skills.length < 10) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Skills',
      suggestion: 'Include more technical and soft skills',
      impact: 'Medium - Will demonstrate broader capabilities'
    })
  }
  
  if (!content.includes('•') && !content.includes('-')) {
    recommendations.push({
      priority: 'low' as const,
      category: 'Formatting',
      suggestion: 'Use bullet points for better readability',
      impact: 'Low - Will improve visual organization'
    })
  }
  
  return recommendations.slice(0, 5)
}
