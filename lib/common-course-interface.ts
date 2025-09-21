// Common Course Interface for YouTube and Udemy
// This provides a unified structure for both platforms

export interface CommonCourse {
  id: string
  title: string
  instructor: string
  description: string
  thumbnail: string
  rating: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  language: string
  price: string
  originalPrice?: string
  category: string
  subcategory: string
  url: string
  lastUpdated: string
  certificate: boolean
  features: string[]
  platform: 'YouTube' | 'Udemy'
  
  // Platform-specific fields (optional)
  studentsEnrolled?: number      // Udemy specific
  viewCount?: number            // YouTube specific
  tags: string[]
  
  // Additional metadata
  difficulty?: string
  prerequisites?: string[]
  learningOutcomes?: string[]
  lastUpdatedFormatted?: string
}

export interface CourseSearchParams {
  query?: string
  platform?: 'youtube' | 'udemy' | 'all'
  level?: string
  category?: string
  price?: 'free' | 'paid' | 'all'
  duration?: 'short' | 'medium' | 'long'
  rating?: number
  language?: string
}

export interface CourseRecommendationParams {
  userSkills: string[]
  interests: string[]
  experience: string
  preferredPlatform?: 'youtube' | 'udemy' | 'all'
  maxDuration?: string
  minRating?: number
}

export interface CourseCategory {
  id: string
  name: string
  icon: string
  keywords: string[]
  platforms: ('youtube' | 'udemy')[]
}

export interface CoursePlatform {
  name: 'YouTube' | 'Udemy'
  icon: string
  color: string
  description: string
  advantages: string[]
  disadvantages: string[]
}

// Common course categories that work for both platforms
export const commonCourseCategories: CourseCategory[] = [
  {
    id: "web-development",
    name: "Web Development",
    icon: "💻",
    keywords: ["web development", "javascript", "react", "html css", "frontend", "backend", "node.js", "angular", "vue"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: "📊",
    keywords: ["data science", "python data", "machine learning", "data analysis", "pandas", "numpy", "scikit-learn", "tensorflow"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    icon: "📱",
    keywords: ["android development", "ios development", "react native", "flutter", "mobile app", "swift", "kotlin"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    icon: "☁️",
    keywords: ["aws tutorial", "azure tutorial", "google cloud", "docker", "kubernetes", "devops", "terraform"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "programming-languages",
    name: "Programming Languages",
    icon: "🐍",
    keywords: ["python", "javascript", "java", "c++", "c#", "go", "rust", "typescript"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "design",
    name: "UI/UX Design",
    icon: "🎨",
    keywords: ["ui ux design", "figma tutorial", "photoshop", "graphic design", "web design", "illustrator", "sketch"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "business",
    name: "Business & Marketing",
    icon: "💼",
    keywords: ["digital marketing", "seo tutorial", "social media marketing", "google ads", "business strategy", "entrepreneurship"],
    platforms: ["youtube", "udemy"]
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "🔒",
    keywords: ["cybersecurity", "ethical hacking", "network security", "penetration testing", "security", "cryptography"],
    platforms: ["youtube", "udemy"]
  }
]

// Platform information
export const coursePlatforms: CoursePlatform[] = [
  {
    name: 'YouTube',
    icon: '▶️',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Free video tutorials and courses',
    advantages: [
      'Completely free',
      'Huge variety of content',
      'Always accessible',
      'Community-driven',
      'Regular updates'
    ],
    disadvantages: [
      'No structured learning path',
      'No certificates',
      'Quality varies significantly',
      'No instructor support'
    ]
  },
  {
    name: 'Udemy',
    icon: '🎓',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    description: 'Structured online courses with certificates',
    advantages: [
      'Structured learning paths',
      'Professional instructors',
      'Course certificates',
      'Lifetime access',
      'Downloadable content',
      'Instructor support'
    ],
    disadvantages: [
      'Most courses are paid',
      'Limited free content',
      'Course quality varies',
      'No refund guarantee on all courses'
    ]
  }
]

// Helper functions for course processing
export class CourseUtils {
  /**
   * Determine course level from title and description
   */
  static determineLevel(title: string, description: string): 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' {
    const text = `${title} ${description}`.toLowerCase()
    
    if (text.includes('beginner') || text.includes('basic') || text.includes('intro') || text.includes('fundamentals') || text.includes('start')) {
      return 'Beginner'
    } else if (text.includes('advanced') || text.includes('expert') || text.includes('master') || text.includes('professional') || text.includes('pro')) {
      return 'Advanced'
    } else if (text.includes('intermediate') || text.includes('intermediate') || text.includes('intermediate')) {
      return 'Intermediate'
    }
    
    return 'All Levels'
  }

  /**
   * Determine category from title and description
   */
  static determineCategory(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase()
    
    for (const category of commonCourseCategories) {
      if (category.keywords.some(keyword => text.includes(keyword))) {
        return category.name
      }
    }
    
    return 'Programming'
  }

  /**
   * Generate tags for course discovery
   */
  static generateTags(title: string, description: string, category: string): string[] {
    const text = `${title} ${description} ${category}`.toLowerCase()
    const allTags = [
      'programming', 'web development', 'python', 'javascript', 'react', 'node.js',
      'machine learning', 'data science', 'aws', 'docker', 'kubernetes', 'devops',
      'mobile development', 'ios', 'android', 'ui/ux', 'design', 'business',
      'marketing', 'finance', 'health', 'fitness', 'music', 'art', 'photography',
      'cybersecurity', 'networking', 'database', 'sql', 'mongodb', 'graphql'
    ]
    
    return allTags.filter(tag => text.includes(tag))
  }

  /**
   * Format duration for display
   */
  static formatDuration(duration: string): string {
    if (duration.includes('PT')) {
      // YouTube ISO 8601 format
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
      if (!match) return 'Unknown'
      
      const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0
      const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0
      const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    
    return duration
  }

  /**
   * Format view count or student count
   */
  static formatCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  /**
   * Get platform icon and color
   */
  static getPlatformInfo(platform: 'YouTube' | 'Udemy') {
    return coursePlatforms.find(p => p.name === platform) || coursePlatforms[0]
  }

  /**
   * Calculate course score for recommendations
   */
  static calculateCourseScore(
    course: CommonCourse,
    userSkills: string[],
    interests: string[],
    experience: string
  ): number {
    let score = 0
    
    // Skill match
    const courseText = `${course.title} ${course.description}`.toLowerCase()
    userSkills.forEach(skill => {
      if (courseText.includes(skill.toLowerCase())) {
        score += 10
      }
    })
    
    // Interest match
    interests.forEach(interest => {
      if (courseText.includes(interest.toLowerCase())) {
        score += 8
      }
    })
    
    // Experience level match
    if (experience === 'beginner' && course.level === 'Beginner') score += 5
    if (experience === 'intermediate' && course.level === 'Intermediate') score += 5
    if (experience === 'advanced' && course.level === 'Advanced') score += 5
    if (course.level === 'All Levels') score += 3
    
    // Platform preference
    if (course.platform === 'Udemy') score += 3 // Structured learning
    if (course.platform === 'YouTube') score += 2 // Free access
    
    // Rating and popularity
    score += course.rating * 2
    const popularity = course.viewCount || course.studentsEnrolled || 0
    score += Math.log(popularity + 1)
    
    return score
  }
}
