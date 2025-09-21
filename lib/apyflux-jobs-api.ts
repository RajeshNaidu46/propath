// Apyflux Jobs API service
export interface JobListing {
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

export interface JobSearchParams {
  query?: string
  location?: string
  experience?: string
  type?: string
  industry?: string
  offset?: number
  limit?: number
}

export interface JobRecommendation {
  job: JobListing
  matchScore: number
  reasoning: string
  skillsMatched: string[]
  skillsMissing: string[]
}

export class ApyfluxJobsAPI {
  private readonly baseUrl = 'https://gateway.apyflux.com/v1/search'
  private readonly headers = {
    'x-app-id': 'c7740ed4-2dd7-4b3a-b11e-d8c546927444',
    'x-client-id': '12kVSmw2lfdbWjhaEwpnJQBwfzx2',
    'x-api-key': 'Go to settings to get API Key' // Placeholder, needs to be set
  }

  /**
   * Test the Apyflux API to understand response structure
   */
  async testAPI(): Promise<any> {
    try {
      console.log('Testing Apyflux API...')
      const url = `${this.baseUrl}?query=developer&page=1&num_pages=1&date_posted=all&remote_jobs_only=false&employment_types=&job_requirements=&job_titles=&company_types=&employer=&actively_hiring=false&radius=&exclude_job_publishers=&fields=`
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`Apyflux API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Apyflux API Test Response:', JSON.stringify(data, null, 2))
      return data
    } catch (error) {
      console.error('Error testing Apyflux API:', error)
      return null
    }
  }

  /**
   * Search for jobs with various filters
   */
  async searchJobs(params: JobSearchParams): Promise<JobListing[]> {
    try {
      const queryParts = []
      if (params.query) queryParts.push(params.query)
      if (params.location) queryParts.push(`in ${params.location}`)
      const query = queryParts.join(' ') || 'developer'

      // Determine how many pages to fetch based on limit
      const limit = params.limit || 50
      const jobsPerPage = 25 // Assuming API returns ~25 jobs per page
      const numPages = Math.ceil(limit / jobsPerPage)
      const maxPages = Math.min(numPages, 5) // Limit to 5 pages max to avoid excessive API calls

      console.log(`Fetching ${maxPages} pages to get up to ${limit} jobs`)

      const allJobs: JobListing[] = []

      // Fetch jobs from multiple pages
      for (let page = 1; page <= maxPages; page++) {
        const urlParams = new URLSearchParams({
          query,
          page: page.toString(),
          num_pages: '1',
          date_posted: 'all',
          remote_jobs_only: params.type === 'Remote' ? 'true' : 'false',
          employment_types: params.type || '',
          job_requirements: params.experience || '',
          job_titles: params.query || '',
          company_types: '',
          employer: '',
          actively_hiring: 'false',
          radius: '',
          exclude_job_publishers: '',
          fields: ''
        })

        const url = `${this.baseUrl}?${urlParams.toString()}`

        console.log(`Apyflux API URL (Page ${page}):`, url)

        const response = await fetch(url, {
          method: 'GET',
          headers: this.headers
        })

        if (!response.ok) {
          throw new Error(`Apyflux API error: ${response.status}`)
        }

        const data = await response.json()
        console.log(`Apyflux API Response (Page ${page}):`, data)

        // Transform the API response to our JobListing interface
        const pageJobs = this.transformJobData(data)

        // Add page jobs to the collection
        allJobs.push(...pageJobs)

        // If we have enough jobs, break early
        if (allJobs.length >= limit) {
          break
        }

        // Add a small delay between requests to be respectful to the API
        if (page < maxPages) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      // Return only the requested number of jobs
      const resultJobs = allJobs.slice(0, limit)
      console.log(`Returning ${resultJobs.length} jobs out of ${allJobs.length} fetched`)

      return resultJobs
    } catch (error) {
      console.error('Error searching Apyflux jobs:', error)
      // Return mock data as fallback
      return this.getMockJobs()
    }
  }

  /**
   * Get job recommendations based on user profile
   */
  async getJobRecommendations(
    userSkills: string[],
    targetRole: string,
    experience: string,
    location?: string
  ): Promise<JobRecommendation[]> {
    try {
      // Search for jobs matching the target role
      const jobs = await this.searchJobs({
        query: targetRole,
        location,
        experience,
        limit: 50
      })

      // Score and rank jobs based on user skills
      const recommendations = jobs.map(job => {
        const { matchScore, skillsMatched, skillsMissing } = this.calculateJobMatch(job, userSkills)

        return {
          job,
          matchScore,
          reasoning: this.generateRecommendationReasoning(job, skillsMatched, skillsMissing),
          skillsMatched,
          skillsMissing
        }
      })

      // Sort by match score (highest first)
      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20) // Top 20 recommendations
    } catch (error) {
      console.error('Error getting job recommendations:', error)
      return []
    }
  }

  /**
   * Get trending jobs in specific industries
   */
  async getTrendingJobs(industry?: string): Promise<JobListing[]> {
    try {
      const jobs = await this.searchJobs({
        industry,
        limit: 30
      })

      // Sort by posted date (most recent first)
      return jobs.sort((a, b) =>
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      )
    } catch (error) {
      console.error('Error getting trending jobs:', error)
      return this.getMockJobs()
    }
  }

  /**
   * Get jobs by company
   */
  async getJobsByCompany(company: string): Promise<JobListing[]> {
    try {
      const jobs = await this.searchJobs({
        query: company,
        limit: 20
      })

      return jobs.filter(job =>
        job.company.toLowerCase().includes(company.toLowerCase())
      )
    } catch (error) {
      console.error('Error getting company jobs:', error)
      return []
    }
  }

  /**
   * Calculate job match score based on user skills
   */
  private calculateJobMatch(job: JobListing, userSkills: string[]): {
    matchScore: number
    skillsMatched: string[]
    skillsMissing: string[]
  } {
    const userSkillsLower = userSkills.map(skill => skill.toLowerCase())
    const jobSkillsLower = job.skills.map(skill => skill.toLowerCase())

    const skillsMatched = jobSkillsLower.filter(skill =>
      userSkillsLower.some(userSkill =>
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    )

    const skillsMissing = jobSkillsLower.filter(skill =>
      !skillsMatched.includes(skill)
    )

    const matchPercentage = (skillsMatched.length / jobSkillsLower.length) * 100
    const baseScore = Math.min(matchPercentage, 100)

    // Bonus points for exact matches
    const exactMatches = skillsMatched.length
    const bonusScore = exactMatches * 5

    const finalScore = Math.min(baseScore + bonusScore, 100)

    return {
      matchScore: Math.round(finalScore),
      skillsMatched: skillsMatched.map(skill =>
        job.skills.find(s => s.toLowerCase() === skill) || skill
      ),
      skillsMissing: skillsMissing.map(skill =>
        job.skills.find(s => s.toLowerCase() === skill) || skill
      )
    }
  }

  /**
   * Generate reasoning for job recommendation
   */
  private generateRecommendationReasoning(
    job: JobListing,
    skillsMatched: string[],
    skillsMissing: string[]
  ): string {
    if (skillsMatched.length === 0) {
      return `This ${job.title} role at ${job.company} could be a great opportunity to learn new skills.`
    }

    if (skillsMatched.length >= job.skills.length * 0.8) {
      return `Excellent match! You have ${skillsMatched.length} out of ${job.skills.length} required skills for this ${job.title} position.`
    }

    if (skillsMatched.length >= job.skills.length * 0.5) {
      return `Good match! You have ${skillsMatched.length} out of ${job.skills.length} required skills. Consider learning ${skillsMissing.slice(0, 3).join(', ')} to improve your chances.`
    }

    return `Partial match with ${skillsMatched.length} out of ${job.skills.length} skills. Focus on developing ${skillsMissing.slice(0, 3).join(', ')} to qualify for this role.`
  }

  /**
   * Transform Apyflux API response to our JobListing interface
   */
  private transformJobData(apiData: any): JobListing[] {
    try {
      // Assuming the API returns an array of jobs or { data: [...] }
      const jobs = apiData.data || apiData || []
      if (!Array.isArray(jobs)) {
        console.log('No valid data structure in API response, using mock data')
        return this.getMockJobs()
      }

      console.log(`Transforming ${jobs.length} jobs from API`)

      return jobs.map((job: any, index: number) => {
        const jobTitle = job.title || job.job_title || job.name || `Job ${index + 1}`
        const company = job.company || job.company_name || job.employer || 'Unknown Company'
        const location = job.location || job.city || job.region || 'Remote'
        const description = job.description || job.summary || job.details || 'No description available'

        const skills = this.extractSkillsFromJob(job)

        const experience = this.determineExperienceLevel(jobTitle, description)
        const type = this.determineJobType(job)

        let applicationUrl = job.application_url || job.url || job.link || job.apply_url
        if (!applicationUrl) {
          applicationUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}`
        }

        return {
          id: job.id || `apyflux-${index}`,
          title: jobTitle,
          company,
          location,
          description: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
          requirements: this.extractRequirements(job),
          salary: job.salary || job.compensation || undefined,
          type,
          experience,
          postedDate: job.posted_date || job.created_at || new Date().toISOString(),
          applicationUrl,
          skills,
          industry: job.industry || this.determineIndustryFromSkills(skills),
          benefits: job.benefits || []
        }
      })
    } catch (error) {
      console.error('Error transforming job data:', error)
      return this.getMockJobs()
    }
  }

  /**
   * Extract skills from job data
   */
  private extractSkillsFromJob(job: any): string[] {
    const skills: string[] = []

    if (job.skills && Array.isArray(job.skills)) {
      skills.push(...job.skills)
    }
    if (job.required_skills && Array.isArray(job.required_skills)) {
      skills.push(...job.required_skills)
    }
    if (job.technical_skills && Array.isArray(job.technical_skills)) {
      skills.push(...job.technical_skills)
    }

    if (skills.length === 0 && job.description) {
      const commonSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
        'Kubernetes', 'Machine Learning', 'Data Science', 'DevOps', 'Agile', 'Scrum'
      ]

      commonSkills.forEach(skill => {
        if (job.description.toLowerCase().includes(skill.toLowerCase())) {
          skills.push(skill)
        }
      })
    }

    return skills.length > 0 ? skills : ['General Skills']
  }

  /**
   * Extract requirements from job data
   */
  private extractRequirements(job: any): string[] {
    if (job.requirements && Array.isArray(job.requirements)) {
      return job.requirements
    }

    if (job.qualifications && Array.isArray(job.qualifications)) {
      return job.qualifications
    }

    const skills = this.extractSkillsFromJob(job)
    return skills.map(skill => `Experience with ${skill}`)
  }

  /**
   * Determine experience level from job title and description
   */
  private determineExperienceLevel(title: string, description: string): 'Entry' | 'Mid-level' | 'Senior' | 'Executive' {
    const text = `${title} ${description}`.toLowerCase()

    if (text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('staff')) {
      return 'Senior'
    } else if (text.includes('junior') || text.includes('entry') || text.includes('associate') || text.includes('graduate')) {
      return 'Entry'
    } else if (text.includes('director') || text.includes('vp') || text.includes('head') || text.includes('chief')) {
      return 'Executive'
    } else {
      return 'Mid-level'
    }
  }

  /**
   * Determine job type from job data
   */
  private determineJobType(job: any): 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote' {
    if (job.type) {
      const type = job.type.toLowerCase()
      if (type.includes('full')) return 'Full-time'
      if (type.includes('part')) return 'Part-time'
      if (type.includes('contract')) return 'Contract'
      if (type.includes('intern')) return 'Internship'
      if (type.includes('remote')) return 'Remote'
    }

    return 'Full-time'
  }

  /**
   * Determine industry from skills
   */
  private determineIndustryFromSkills(skills: string[]): string {
    const skillText = skills.join(' ').toLowerCase()

    if (skillText.includes('react') || skillText.includes('javascript') || skillText.includes('web')) {
      return 'Technology'
    } else if (skillText.includes('python') || skillText.includes('machine learning') || skillText.includes('data')) {
      return 'Data Science'
    } else if (skillText.includes('aws') || skillText.includes('cloud') || skillText.includes('devops')) {
      return 'Cloud Computing'
    } else {
      return 'Technology'
    }
  }

  /**
   * Mock jobs data for fallback and testing
   */
  private getMockJobs(): JobListing[] {
    return [
      {
        id: 'apyflux-12345',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
        requirements: [
          '5+ years of experience with React, TypeScript, and modern JavaScript',
          'Strong understanding of web performance and accessibility',
          'Experience with state management libraries (Redux, Zustand)',
          'Knowledge of CSS-in-JS and responsive design'
        ],
        salary: '$120,000 - $150,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: '2024-01-15',
        applicationUrl: 'https://www.linkedin.com/jobs/view/12345',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux'],
        industry: 'Technology',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options']
      },
      // ... (same mock data as before, but with apyflux- prefix)
      {
        id: 'apyflux-67890',
        title: 'Data Scientist',
        company: 'DataFlow Analytics',
        location: 'New York, NY',
        description: 'Join our data science team to develop machine learning models and drive business insights.',
        requirements: [
          'MS/PhD in Computer Science, Statistics, or related field',
          'Experience with Python, R, and SQL',
          'Knowledge of machine learning algorithms and statistical analysis',
          'Experience with big data technologies (Spark, Hadoop)'
        ],
        salary: '$130,000 - $160,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-14',
        applicationUrl: 'https://www.linkedin.com/jobs/view/67890',
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'R', 'Spark'],
        industry: 'Analytics',
        benefits: ['Health Insurance', '401k', 'Professional Development', 'Flexible Hours']
      }
      // Add more if needed, but keeping it short
    ]
  }
}

// Export singleton instance
export const apyfluxJobsAPI = new ApyfluxJobsAPI()
