// LinkedIn Jobs API service using RapidAPI
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

export class LinkedInJobsAPI {
  private readonly apiKey = '6158ea0810msh0633f9259169bf7p1c2100jsn818296c2d71c'
  private readonly apiHost = 'linkedin-job-search-api.p.rapidapi.com'
  private readonly baseUrl = 'https://linkedin-job-search-api.p.rapidapi.com'

  /**
   * Test the LinkedIn API to understand response structure
   */
  async testAPI(): Promise<any> {
    try {
      console.log('Testing LinkedIn API...')
      const response = await fetch(`${this.baseUrl}/active-jb-1h?limit=1`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`LinkedIn Jobs API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('LinkedIn API Test Response:', JSON.stringify(data, null, 2))
      return data
    } catch (error) {
      console.error('Error testing LinkedIn API:', error)
      return null
    }
  }

  /**
   * Search for jobs with various filters
   */
  async searchJobs(params: JobSearchParams): Promise<JobListing[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.query) queryParams.append('query', params.query)
      if (params.location) queryParams.append('location', params.location)
      if (params.experience) queryParams.append('experience', params.experience)
      if (params.type) queryParams.append('type', params.type)
      if (params.industry) queryParams.append('industry', params.industry)
      if (params.offset) queryParams.append('offset', params.offset.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const url = `${this.baseUrl}/active-jb-1h?${queryParams.toString()}`
      
      console.log('LinkedIn API URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`LinkedIn Jobs API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('LinkedIn API Response:', data)
      
      // Transform the API response to our JobListing interface
      return this.transformJobData(data)
    } catch (error) {
      console.error('Error searching LinkedIn jobs:', error)
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
   * Transform LinkedIn API response to our JobListing interface
   */
  private transformJobData(apiData: any): JobListing[] {
    try {
      // Check if the API returned data
      if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
        console.log('No valid data structure in API response, using mock data')
        return this.getMockJobs()
      }

      const jobs = apiData.data
      console.log(`Transforming ${jobs.length} jobs from API`)

      return jobs.map((job: any, index: number) => {
        // Extract job details from the API response
        const jobTitle = job.title || job.job_title || job.name || `Job ${index + 1}`
        const company = job.company || job.company_name || job.employer || 'Unknown Company'
        const location = job.location || job.city || job.region || 'Remote'
        const description = job.description || job.summary || job.details || 'No description available'
        
        // Extract skills from various possible fields
        const skills = this.extractSkillsFromJob(job)
        
        // Determine experience level from title/description
        const experience = this.determineExperienceLevel(jobTitle, description)
        
        // Determine job type
        const type = this.determineJobType(job)
        
        // Generate application URL - prioritize real LinkedIn URLs
        let applicationUrl = job.application_url || job.url || job.link || job.apply_url || job.linkedin_url
        
        // If no URL provided, try to construct a LinkedIn job URL
        if (!applicationUrl) {
          if (job.linkedin_job_id) {
            applicationUrl = `https://www.linkedin.com/jobs/view/${job.linkedin_job_id}`
          } else if (job.id && job.id.toString().startsWith('linkedin-')) {
            applicationUrl = `https://www.linkedin.com/jobs/view/${job.id.replace('linkedin-', '')}`
          } else {
            // Fallback to LinkedIn jobs search
            const searchQuery = encodeURIComponent(`${jobTitle} ${company}`)
            applicationUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${encodeURIComponent(location)}`
          }
        }
        
        // Ensure the URL is a valid LinkedIn URL
        if (applicationUrl && !applicationUrl.includes('linkedin.com')) {
          // If it's not a LinkedIn URL, redirect to LinkedIn jobs search
          const searchQuery = encodeURIComponent(`${jobTitle} ${company}`)
          applicationUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${encodeURIComponent(location)}`
        }

        return {
          id: job.id || `linkedin-${index}`,
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
    
    // Check various possible skill fields
    if (job.skills && Array.isArray(job.skills)) {
      skills.push(...job.skills)
    }
    if (job.required_skills && Array.isArray(job.required_skills)) {
      skills.push(...job.required_skills)
    }
    if (job.technical_skills && Array.isArray(job.technical_skills)) {
      skills.push(...job.technical_skills)
    }
    
    // Extract skills from description if no explicit skills field
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
    
    // Generate basic requirements from skills
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
    
    // Default to full-time
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
        id: 'linkedin-12345',
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
      {
        id: 'linkedin-67890',
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
      },
      {
        id: 'linkedin-11111',
        title: 'DevOps Engineer',
        company: 'CloudScale Solutions',
        location: 'Austin, TX',
        description: 'Help us build and maintain scalable cloud infrastructure and CI/CD pipelines.',
        requirements: [
          '3+ years of experience with AWS, Azure, or GCP',
          'Experience with Docker, Kubernetes, and Terraform',
          'Knowledge of CI/CD tools (Jenkins, GitLab CI, GitHub Actions)',
          'Strong scripting skills (Python, Bash)'
        ],
        salary: '$110,000 - $140,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-13',
        applicationUrl: 'https://www.linkedin.com/jobs/view/11111',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Jenkins'],
        industry: 'Cloud Computing',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Training Budget']
      },
      {
        id: 'linkedin-22222',
        title: 'Product Manager',
        company: 'InnovateTech',
        location: 'Seattle, WA',
        description: 'Lead product strategy and development for our next-generation software platform.',
        requirements: [
          '5+ years of product management experience',
          'Strong analytical and problem-solving skills',
          'Experience with agile methodologies and user research',
          'Excellent communication and stakeholder management'
        ],
        salary: '$140,000 - $180,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: '2024-01-12',
        applicationUrl: 'https://www.linkedin.com/jobs/view/22222',
        skills: ['Product Management', 'Agile', 'User Research', 'Analytics', 'Strategy'],
        industry: 'Technology',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options', 'Flexible Hours']
      },
      {
        id: 'linkedin-33333',
        title: 'UX/UI Designer',
        company: 'DesignStudio',
        location: 'Los Angeles, CA',
        description: 'Create beautiful and intuitive user experiences for web and mobile applications.',
        requirements: [
          '3+ years of UX/UI design experience',
          'Proficiency in Figma, Sketch, or Adobe Creative Suite',
          'Strong understanding of user-centered design principles',
          'Experience with design systems and prototyping'
        ],
        salary: '$90,000 - $130,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-11',
        applicationUrl: 'https://www.linkedin.com/jobs/view/33333',
        skills: ['UX Design', 'UI Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems'],
        industry: 'Design',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Professional Development']
      },
      {
        id: 'linkedin-44444',
        title: 'Backend Developer',
        company: 'ServerTech',
        location: 'Boston, MA',
        description: 'Build scalable backend services and APIs using modern technologies.',
        requirements: [
          '4+ years of backend development experience',
          'Strong knowledge of Node.js, Python, or Java',
          'Experience with databases (PostgreSQL, MongoDB)',
          'Knowledge of microservices architecture'
        ],
        salary: '$100,000 - $140,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-10',
        applicationUrl: 'https://www.linkedin.com/jobs/view/44444',
        skills: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Microservices'],
        industry: 'Technology',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Training Budget']
      },
      {
        id: 'linkedin-55555',
        title: 'Machine Learning Engineer',
        company: 'AITech Solutions',
        location: 'Palo Alto, CA',
        description: 'Develop and deploy machine learning models for production systems.',
        requirements: [
          'MS/PhD in Computer Science or related field',
          'Experience with TensorFlow, PyTorch, or similar frameworks',
          'Strong Python programming skills',
          'Knowledge of MLOps and model deployment'
        ],
        salary: '$150,000 - $200,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: '2024-01-09',
        applicationUrl: 'https://www.linkedin.com/jobs/view/55555',
        skills: ['Machine Learning', 'TensorFlow', 'PyTorch', 'Python', 'MLOps', 'Deep Learning'],
        industry: 'Artificial Intelligence',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options', 'Research Budget']
      },
      {
        id: 'linkedin-66666',
        title: 'Cybersecurity Analyst',
        company: 'SecureNet',
        location: 'Washington, DC',
        description: 'Protect our systems and data from cyber threats and vulnerabilities.',
        requirements: [
          '3+ years of cybersecurity experience',
          'Knowledge of security frameworks and compliance',
          'Experience with security tools and monitoring',
          'Strong analytical and incident response skills'
        ],
        salary: '$95,000 - $135,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-08',
        applicationUrl: 'https://www.linkedin.com/jobs/view/66666',
        skills: ['Cybersecurity', 'Security Frameworks', 'Incident Response', 'Monitoring', 'Compliance'],
        industry: 'Security',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Security Clearance']
      },
      {
        id: 'linkedin-77777',
        title: 'Full Stack Developer',
        company: 'WebTech Pro',
        location: 'Chicago, IL',
        description: 'Build end-to-end web applications using modern frontend and backend technologies.',
        requirements: [
          '3+ years of full stack development experience',
          'Proficiency in React, Node.js, and databases',
          'Experience with cloud platforms (AWS, Azure)',
          'Strong problem-solving and debugging skills'
        ],
        salary: '$85,000 - $125,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-07',
        applicationUrl: 'https://www.linkedin.com/jobs/view/77777',
        skills: ['React', 'Node.js', 'JavaScript', 'Databases', 'AWS', 'Full Stack'],
        industry: 'Technology',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Professional Development']
      },
      {
        id: 'linkedin-88888',
        title: 'Data Engineer',
        company: 'DataWorks',
        location: 'Denver, CO',
        description: 'Design and build data pipelines for large-scale data processing.',
        requirements: [
          '4+ years of data engineering experience',
          'Experience with Apache Spark, Kafka, and data warehouses',
          'Strong SQL and Python programming skills',
          'Knowledge of ETL processes and data modeling'
        ],
        salary: '$110,000 - $150,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-06',
        applicationUrl: 'https://www.linkedin.com/jobs/view/88888',
        skills: ['Apache Spark', 'Kafka', 'SQL', 'Python', 'ETL', 'Data Modeling'],
        industry: 'Data Engineering',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Training Budget']
      },
      {
        id: 'linkedin-99999',
        title: 'QA Engineer',
        company: 'QualityTech',
        location: 'Portland, OR',
        description: 'Ensure software quality through comprehensive testing and automation.',
        requirements: [
          '3+ years of QA engineering experience',
          'Experience with automated testing frameworks',
          'Knowledge of testing methodologies and tools',
          'Strong attention to detail and analytical skills'
        ],
        salary: '$80,000 - $120,000',
        type: 'Full-time',
        experience: 'Mid-level',
        postedDate: '2024-01-05',
        applicationUrl: 'https://www.linkedin.com/jobs/view/99999',
        skills: ['QA Testing', 'Automation', 'Selenium', 'Jest', 'Testing Methodologies'],
        industry: 'Quality Assurance',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Professional Development']
      },
      {
        id: 'linkedin-10101',
        title: 'Cloud Architect',
        company: 'CloudFirst',
        location: 'Atlanta, GA',
        description: 'Design and implement cloud infrastructure solutions for enterprise clients.',
        requirements: [
          '5+ years of cloud architecture experience',
          'Expert knowledge of AWS, Azure, or GCP',
          'Experience with infrastructure as code (Terraform, CloudFormation)',
          'Strong understanding of security and compliance'
        ],
        salary: '$130,000 - $180,000',
        type: 'Full-time',
        experience: 'Senior',
        postedDate: '2024-01-04',
        applicationUrl: 'https://www.linkedin.com/jobs/view/10101',
        skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Cloud Architecture', 'Security'],
        industry: 'Cloud Computing',
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options']
      }
    ]
  }
}

// Export singleton instance
export const linkedInJobsAPI = new LinkedInJobsAPI()
