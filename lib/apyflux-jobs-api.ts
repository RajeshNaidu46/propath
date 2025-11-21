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
  private readonly apiId: string
  private readonly apiKey: string
  private readonly headers: HeadersInit

  constructor() {
    // Get credentials from environment variables
    this.apiId = process.env.NEXT_PUBLIC_APYFLUX_API_ID || 'a63149f4'
    this.apiKey = process.env.NEXT_PUBLIC_APYFLUX_API_KEY || 'ef6faec478f28f070f342a8ed1758783'
    
    this.headers = {
      'x-app-id': this.apiId,
      'x-api-key': this.apiKey
    }
    
    console.log('Apyflux API initialized with ID:', this.apiId)
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
      const query = queryParts.join(' ') || 'software developer'

      // Determine how many pages to fetch based on limit
      const limit = params.limit || 50
      const jobsPerPage = 10 // Conservative estimate
      const numPages = Math.ceil(limit / jobsPerPage)
      const maxPages = Math.min(numPages, 3) // Limit to 3 pages to avoid API issues

      console.log(`Fetching ${maxPages} pages to get up to ${limit} jobs`)

      const allJobs: JobListing[] = []

      // Fetch jobs from multiple pages
      for (let page = 1; page <= maxPages; page++) {
        try {
          const urlParams = new URLSearchParams({
            query,
            page: page.toString(),
            num_pages: '1',
            date_posted: 'week',
            remote_jobs_only: params.type === 'Remote' ? 'true' : 'false'
          })

          const url = `${this.baseUrl}?${urlParams.toString()}`

          console.log(`Apyflux API URL (Page ${page}):`, url)
          console.log('Headers:', this.headers)

          const response = await fetch(url, {
            method: 'GET',
            headers: this.headers,
            signal: AbortSignal.timeout(10000) // 10 second timeout
          })

          if (!response.ok) {
            console.error(`Apyflux API error: ${response.status} ${response.statusText}`)
            const errorText = await response.text()
            console.error('Error response:', errorText)
            break
          }

          const data = await response.json()
          console.log(`Apyflux API Response (Page ${page}):`, JSON.stringify(data).substring(0, 500))

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
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (pageError) {
          console.error(`Error fetching page ${page}:`, pageError)
          // Continue to next page or break if it's the first page
          if (page === 1) {
            break
          }
        }
      }

      // Return only the requested number of jobs
      const resultJobs = allJobs.slice(0, limit)
      console.log(`Returning ${resultJobs.length} jobs out of ${allJobs.length} fetched`)

      // If no jobs were fetched, return mock data
      if (resultJobs.length === 0) {
        console.log('No jobs fetched from API, using mock data')
        return this.getMockJobs()
      }

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
    const today = new Date()
    const getRecentDate = (daysAgo: number) => {
      const date = new Date(today)
      date.setDate(date.getDate() - daysAgo)
      return date.toISOString()
    }

    return [
      {
        id: 'apyflux-12345',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'Bangalore, India',
        description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences with modern React and TypeScript.',
        requirements: [
          '5+ years of experience with React, TypeScript, and modern JavaScript',
          'Strong understanding of web performance and accessibility',
          'Experience with state management libraries (Redux, Zustand)',
          'Knowledge of CSS-in-JS and responsive design'
        ],
        salary: '₹20,00,000 - ₹30,00,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: getRecentDate(1),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Senior%20Frontend%20Developer&location=Bangalore',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux'],
        industry: 'Technology',
        benefits: ['Health Insurance', 'Work from Home', 'Performance Bonus', 'Stock Options']
      },
      {
        id: 'apyflux-67890',
        title: 'Full Stack Developer',
        company: 'StartupX',
        location: 'Hyderabad, India',
        description: 'Join our innovative startup to build scalable web applications using MERN stack and cloud technologies.',
        requirements: [
          '3+ years of full stack development experience',
          'Proficiency in React, Node.js, and MongoDB',
          'Experience with AWS or Azure cloud services',
          'Strong problem-solving and debugging skills'
        ],
        salary: '₹12,00,000 - ₹18,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(2),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer&location=Hyderabad',
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'JavaScript', 'Express'],
        industry: 'Technology',
        benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Team Outings']
      },
      {
        id: 'apyflux-11111',
        title: 'Data Scientist',
        company: 'DataFlow Analytics',
        location: 'Mumbai, India',
        description: 'Join our data science team to develop machine learning models and drive business insights using Python and modern ML frameworks.',
        requirements: [
          'MS/PhD in Computer Science, Statistics, or related field',
          'Experience with Python, TensorFlow, and scikit-learn',
          'Knowledge of machine learning algorithms and statistical analysis',
          'Experience with big data technologies (Spark, Hadoop)'
        ],
        salary: '₹15,00,000 - ₹25,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(3),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist&location=Mumbai',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Statistics', 'SQL', 'Spark'],
        industry: 'Analytics',
        benefits: ['Health Insurance', 'Remote Work', 'Professional Development', 'Performance Bonus']
      },
      {
        id: 'apyflux-22222',
        title: 'DevOps Engineer',
        company: 'CloudScale Solutions',
        location: 'Pune, India',
        description: 'Help us build and maintain scalable cloud infrastructure and CI/CD pipelines using modern DevOps tools.',
        requirements: [
          '3+ years of experience with AWS, Azure, or GCP',
          'Experience with Docker, Kubernetes, and Terraform',
          'Knowledge of CI/CD tools (Jenkins, GitLab CI, GitHub Actions)',
          'Strong scripting skills (Python, Bash)'
        ],
        salary: '₹14,00,000 - ₹22,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(1),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=DevOps%20Engineer&location=Pune',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Jenkins'],
        industry: 'Cloud Computing',
        benefits: ['Health Insurance', 'Work from Home', 'Training Budget', 'Flexible Hours']
      },
      {
        id: 'apyflux-33333',
        title: 'Backend Developer',
        company: 'FinTech Pro',
        location: 'Bangalore, India',
        description: 'Build scalable backend services and APIs for our fintech platform using Node.js and microservices architecture.',
        requirements: [
          '4+ years of backend development experience',
          'Strong knowledge of Node.js and Express',
          'Experience with databases (PostgreSQL, MongoDB)',
          'Knowledge of microservices architecture and REST APIs'
        ],
        salary: '₹15,00,000 - ₹24,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(2),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Backend%20Developer&location=Bangalore',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Microservices', 'REST API'],
        industry: 'FinTech',
        benefits: ['Health Insurance', 'Stock Options', 'Work from Home', 'Performance Bonus']
      },
      {
        id: 'apyflux-44444',
        title: 'React Native Developer',
        company: 'MobileFirst Apps',
        location: 'Delhi, India',
        description: 'Create beautiful and performant mobile applications using React Native for both iOS and Android platforms.',
        requirements: [
          '3+ years of React Native development experience',
          'Strong knowledge of JavaScript/TypeScript and React',
          'Experience with mobile app deployment (App Store, Play Store)',
          'Knowledge of native modules and third-party libraries'
        ],
        salary: '₹12,00,000 - ₹20,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(4),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=React%20Native%20Developer&location=Delhi',
        skills: ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android', 'Redux'],
        industry: 'Mobile Development',
        benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Remote Work']
      },
      {
        id: 'apyflux-55555',
        title: 'Machine Learning Engineer',
        company: 'AITech Solutions',
        location: 'Bangalore, India',
        description: 'Develop and deploy machine learning models for production systems using cutting-edge AI technologies.',
        requirements: [
          'MS/PhD in Computer Science or related field',
          'Experience with TensorFlow, PyTorch, or similar frameworks',
          'Strong Python programming skills',
          'Knowledge of MLOps and model deployment'
        ],
        salary: '₹18,00,000 - ₹32,00,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: getRecentDate(1),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Engineer&location=Bangalore',
        skills: ['Machine Learning', 'TensorFlow', 'PyTorch', 'Python', 'MLOps', 'Deep Learning'],
        industry: 'Artificial Intelligence',
        benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Research Budget']
      },
      {
        id: 'apyflux-66666',
        title: 'UI/UX Designer',
        company: 'DesignStudio',
        location: 'Mumbai, India',
        description: 'Create beautiful and intuitive user experiences for web and mobile applications using modern design tools.',
        requirements: [
          '3+ years of UX/UI design experience',
          'Proficiency in Figma, Sketch, or Adobe Creative Suite',
          'Strong understanding of user-centered design principles',
          'Experience with design systems and prototyping'
        ],
        salary: '₹10,00,000 - ₹18,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(3),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=UI%20UX%20Designer&location=Mumbai',
        skills: ['UX Design', 'UI Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems'],
        industry: 'Design',
        benefits: ['Health Insurance', 'Remote Work', 'Professional Development', 'Creative Freedom']
      },
      {
        id: 'apyflux-77777',
        title: 'Cloud Solutions Architect',
        company: 'CloudTech Innovations',
        location: 'Bangalore, India',
        description: 'Design and implement enterprise-level cloud solutions using AWS, Azure, and GCP for our global clients.',
        requirements: [
          '5+ years of cloud architecture experience',
          'Expertise in AWS, Azure, or Google Cloud Platform',
          'Experience with microservices and serverless architectures',
          'Strong knowledge of cloud security and compliance'
        ],
        salary: '₹25,00,000 - ₹40,00,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: getRecentDate(1),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Cloud%20Solutions%20Architect&location=Bangalore',
        skills: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Microservices', 'Security'],
        industry: 'Cloud Computing',
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Training Budget']
      },
      {
        id: 'apyflux-88888',
        title: 'Product Manager',
        company: 'InnovateTech Solutions',
        location: 'Pune, India',
        description: 'Lead product strategy and roadmap for our SaaS platform, working closely with engineering and design teams.',
        requirements: [
          '4+ years of product management experience',
          'Strong analytical and problem-solving skills',
          'Experience with agile methodologies',
          'Excellent communication and stakeholder management'
        ],
        salary: '₹18,00,000 - ₹28,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(2),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Product%20Manager&location=Pune',
        skills: ['Product Management', 'Agile', 'Roadmap Planning', 'Stakeholder Management', 'Analytics'],
        industry: 'Technology',
        benefits: ['Health Insurance', 'Performance Bonus', 'Stock Options', 'Flexible Hours']
      },
      {
        id: 'apyflux-99999',
        title: 'Cybersecurity Analyst',
        company: 'SecureNet India',
        location: 'Hyderabad, India',
        description: 'Protect enterprise systems from cyber threats, conduct security assessments, and implement security best practices.',
        requirements: [
          '3+ years of cybersecurity experience',
          'Knowledge of security frameworks (ISO 27001, NIST)',
          'Experience with SIEM tools and threat detection',
          'Strong understanding of network security and encryption'
        ],
        salary: '₹16,00,000 - ₹25,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(1),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Cybersecurity%20Analyst&location=Hyderabad',
        skills: ['Cybersecurity', 'SIEM', 'Threat Detection', 'Network Security', 'Penetration Testing'],
        industry: 'Security',
        benefits: ['Health Insurance', 'Security Certifications', 'Remote Work', 'Learning Budget']
      },
      {
        id: 'apyflux-10101',
        title: 'Quality Assurance Engineer',
        company: 'TestPro Solutions',
        location: 'Chennai, India',
        description: 'Ensure software quality through comprehensive testing, automation, and continuous improvement of QA processes.',
        requirements: [
          '3+ years of QA/Testing experience',
          'Proficiency in automation tools (Selenium, Cypress, Jest)',
          'Strong understanding of testing methodologies',
          'Experience with API and performance testing'
        ],
        salary: '₹12,00,000 - ₹20,00,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: getRecentDate(2),
        applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=QA%20Engineer&location=Chennai',
        skills: ['QA Testing', 'Selenium', 'Cypress', 'Test Automation', 'API Testing', 'Performance Testing'],
        industry: 'Quality Assurance',
        benefits: ['Health Insurance', 'Work from Home', 'Professional Development', 'Team Events']
      }
    ]
  }
}

// Export singleton instance
export const apyfluxJobsAPI = new ApyfluxJobsAPI()