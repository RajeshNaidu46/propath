// Udemy API service using RapidAPI
import { CommonCourse, CourseUtils } from './common-course-interface'

export interface UdemyCourse {
  id: string
  title: string
  instructor: string
  description: string
  thumbnail: string
  rating: number
  studentsEnrolled: number
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
}

export interface UdemySearchParams {
  query?: string
  page?: number
  pageSize?: number
  level?: string
  language?: string
  category?: string
  price?: 'free' | 'paid' | 'all'
  rating?: number
}

export class UdemyAPI {
  private readonly apiKey = '6158ea0810msh0633f9259169bf7p1c2100jsn818296c2d71c'
  private readonly apiHost = 'udemy-paid-courses-for-free-api.p.rapidapi.com'
  private readonly baseUrl = 'https://udemy-paid-courses-for-free-api.p.rapidapi.com'

  /**
   * Transform Udemy course data to common interface
   */
  private transformToCommonCourse(udemyCourse: UdemyCourse): CommonCourse {
    return {
      id: udemyCourse.id || `udemy-${Date.now()}`,
      title: udemyCourse.title || 'Untitled Course',
      instructor: udemyCourse.instructor || 'Unknown Instructor',
      description: udemyCourse.description || 'No description available',
      thumbnail: udemyCourse.thumbnail || '/placeholder-thumbnail.jpg',
      rating: udemyCourse.rating || 4.0,
      duration: udemyCourse.duration || '0:00',
      level: udemyCourse.level || 'Beginner',
      language: udemyCourse.language || 'English',
      price: udemyCourse.price || 'Free',
      originalPrice: udemyCourse.originalPrice,
      category: udemyCourse.category || 'Programming',
      subcategory: udemyCourse.subcategory || 'General',
      url: udemyCourse.url || '#',
      lastUpdated: udemyCourse.lastUpdated || new Date().toISOString(),
      certificate: udemyCourse.certificate || false,
      features: udemyCourse.features || ['Course Content', 'Lifetime Access'],
      platform: 'Udemy',
      studentsEnrolled: udemyCourse.studentsEnrolled || 0,
      tags: CourseUtils.generateTags(udemyCourse.title || '', udemyCourse.description || '', udemyCourse.category || 'Programming'),
      lastUpdatedFormatted: new Date(udemyCourse.lastUpdated || Date.now()).toLocaleDateString()
    }
  }

  /**
   * Search for Udemy courses
   */
  async searchCourses(params: UdemySearchParams): Promise<CommonCourse[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.query) queryParams.append('query', params.query)
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.pageSize) queryParams.append('page_size', params.pageSize.toString())

      const url = `${this.baseUrl}/rapidapi/courses/search?${queryParams.toString()}`
      
      console.log('Udemy API URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Udemy API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Udemy API Response:', data)
      
      const courses = this.transformCourseData(data)
      return courses.map(course => this.transformToCommonCourse(course))
    } catch (error) {
      console.error('Error searching Udemy courses:', error)
      const mockCourses = this.getMockUdemyCourses()
      return mockCourses.map(course => this.transformToCommonCourse(course))
    }
  }

  /**
   * Get trending Udemy courses
   */
  async getTrendingCourses(category?: string): Promise<CommonCourse[]> {
    try {
      const params: UdemySearchParams = {
        page: 1,
        pageSize: 20
      }
      
      if (category) {
        params.query = category
      }

      const courses = await this.searchCourses(params)
      return courses
    } catch (error) {
      console.error('Error getting trending Udemy courses:', error)
      const mockCourses = this.getMockUdemyCourses()
      return mockCourses.map(course => this.transformToCommonCourse(course))
    }
  }

  /**
   * Get free Udemy courses
   */
  async getFreeCourses(query?: string): Promise<CommonCourse[]> {
    try {
      const params: UdemySearchParams = {
        query: query || 'programming',
        page: 1,
        pageSize: 15
      }

      const courses = await this.searchCourses(params)
      // Filter for free courses (this will depend on the actual API response)
      const freeCourses = courses.filter(course => 
        course.price.toLowerCase().includes('free') || 
        course.price === '0' || 
        course.price === '$0'
      )
      return freeCourses
    } catch (error) {
      console.error('Error getting free Udemy courses:', error)
      const mockCourses = this.getMockUdemyCourses()
      const freeCourses = mockCourses.filter(course => 
        course.price.toLowerCase().includes('free')
      )
      return freeCourses.map(course => this.transformToCommonCourse(course))
    }
  }

  /**
   * Transform Udemy API response to our Course interface
   */
  private transformCourseData(apiData: any): UdemyCourse[] {
    try {
      // Check if the API returned data
      if (!apiData || !apiData.courses || !Array.isArray(apiData.courses)) {
        console.log('No valid course data structure in Udemy API response, using mock data')
        return this.getMockUdemyCourses()
      }

      const courses = apiData.courses
      console.log(`Transforming ${courses.length} Udemy courses from API`)

      return courses.map((course: any, index: number) => {
        // Extract course details from the API response
        const courseTitle = course.title || course.name || course.headline || `Course ${index + 1}`
        const instructor = course.instructor || course.instructors?.[0]?.name || 'Unknown Instructor'
        const description = course.description || course.headline || course.summary || 'No description available'
        const thumbnail = course.thumbnail || course.image || course.preview_image || ''
        
        // Determine course level
        const level = this.determineCourseLevel(courseTitle, description)
        
        // Extract features
        const features = this.extractCourseFeatures(course)
        
        // Generate course URL
        const courseUrl = course.url || course.link || `https://www.udemy.com/course/${course.id || index}`

        return {
          id: course.id || `udemy-${index}`,
          title: courseTitle,
          instructor,
          description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
          thumbnail,
          rating: course.rating || course.avg_rating || course.stars || 4.0,
          studentsEnrolled: course.students_enrolled || course.num_students || course.enrollment || 1000,
          duration: course.duration || course.content_length || course.total_hours || '2-3 hours',
          level,
          language: course.language || course.locale || 'English',
          price: course.price || course.discount_price || course.current_price || 'Free',
          originalPrice: course.original_price || course.list_price || undefined,
          category: course.category || course.primary_category || 'Development',
          subcategory: course.subcategory || course.secondary_category || 'Programming',
          url: courseUrl,
          lastUpdated: course.last_updated || course.created || course.published_time || new Date().toISOString(),
          certificate: course.certificate || course.has_certificate || true,
          features
        }
      })
    } catch (error) {
      console.error('Error transforming Udemy course data:', error)
      return this.getMockUdemyCourses()
    }
  }

  /**
   * Determine course level from title and description
   */
  private determineCourseLevel(title: string, description: string): 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' {
    const text = `${title} ${description}`.toLowerCase()
    
    if (text.includes('beginner') || text.includes('basic') || text.includes('intro') || text.includes('fundamentals')) {
      return 'Beginner'
    } else if (text.includes('advanced') || text.includes('expert') || text.includes('master') || text.includes('professional')) {
      return 'Advanced'
    } else if (text.includes('intermediate') || text.includes('intermediate') || text.includes('intermediate')) {
      return 'Intermediate'
    } else {
      return 'All Levels'
    }
  }

  /**
   * Extract course features
   */
  private extractCourseFeatures(course: any): string[] {
    const features: string[] = []
    
    if (course.features && Array.isArray(course.features)) {
      features.push(...course.features)
    }
    
    if (course.what_you_will_learn && Array.isArray(course.what_you_will_learn)) {
      features.push(...course.what_you_will_learn.slice(0, 3))
    }
    
    // Add common features if none exist
    if (features.length === 0) {
      features.push('HD Video Lectures', 'Lifetime Access', 'Certificate of Completion')
    }
    
    return features
  }

  /**
   * Mock Udemy courses data for fallback and testing
   */
  private getMockUdemyCourses(): UdemyCourse[] {
    return [
      {
        id: 'udemy-12345',
        title: 'Complete Python Bootcamp: From Zero to Hero',
        instructor: 'Jose Portilla',
        description: 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!',
        thumbnail: 'https://img-c.udemycdn.com/course/750x422/394676_ce3d_5.jpg',
        rating: 4.6,
        studentsEnrolled: 1500000,
        duration: '22 hours',
        level: 'Beginner',
        language: 'English',
        price: 'Free',
        originalPrice: '$199.99',
        category: 'Development',
        subcategory: 'Programming Languages',
        url: 'https://www.udemy.com/course/complete-python-bootcamp/',
        lastUpdated: '2024-01-15',
        certificate: true,
        features: ['HD Video Lectures', 'Lifetime Access', 'Certificate of Completion', '30-Day Money-Back Guarantee']
      },
      {
        id: 'udemy-67890',
        title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
        instructor: 'Maximilian Schwarzmüller',
        description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        thumbnail: 'https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg',
        rating: 4.7,
        studentsEnrolled: 800000,
        duration: '48 hours',
        level: 'Intermediate',
        language: 'English',
        price: 'Free',
        originalPrice: '$89.99',
        category: 'Development',
        subcategory: 'Web Development',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        lastUpdated: '2024-01-10',
        certificate: true,
        features: ['HD Video Lectures', 'Lifetime Access', 'Certificate of Completion', 'Source Code']
      },
      {
        id: 'udemy-11111',
        title: 'Machine Learning A-Z™: Hands-On Python & R In Data Science',
        instructor: 'Kirill Eremenko',
        description: 'Learn to create Machine Learning algorithms in Python and R from two Data Science experts. Code templates included.',
        thumbnail: 'https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg',
        rating: 4.5,
        studentsEnrolled: 1200000,
        duration: '44 hours',
        level: 'Advanced',
        language: 'English',
        price: 'Free',
        originalPrice: '$199.99',
        category: 'Data Science',
        subcategory: 'Machine Learning',
        url: 'https://www.udemy.com/course/machinelearning/',
        lastUpdated: '2024-01-08',
        certificate: true,
        features: ['HD Video Lectures', 'Lifetime Access', 'Certificate of Completion', 'Python & R Code Templates']
      }
    ]
  }
}

// Export singleton instance
export const udemyAPI = new UdemyAPI()