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
  // SECURITY: Use environment variable for API key, fallback to old key only if not set
  private readonly apiKey = process.env.UDEMY_API_KEY || '6158ea0810msh0633f9259169bf7p1c2100jsn818296c2d71c'
  private readonly apiHost = 'udemy-paid-courses-for-free-api.p.rapidapi.com'
  private readonly baseUrl = 'https://udemy-paid-courses-for-free-api.p.rapidapi.com'

  // ... rest of the file unchanged ...
}

// Export singleton instance
export const udemyAPI = new UdemyAPI()