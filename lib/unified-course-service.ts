// Unified Course Recommendation Service
// Combines Udemy and YouTube APIs for comprehensive course discovery

import { udemyAPI } from './udemy-api'
import { getYouTubeCourses, searchYouTubeCourses, getTrendingCourses as getYouTubeTrending } from './youtube-api'
import { CommonCourse, CourseSearchParams, CourseUtils } from './common-course-interface'

export class UnifiedCourseService {
  /**
   * Search for courses across both platforms
   */
  async searchCourses(params: CourseSearchParams): Promise<CommonCourse[]> {
    try {
      const { query, platform = 'all' } = params
      
      let udemyCourses: CommonCourse[] = []
      let youtubeCourses: CommonCourse[] = []
      
      // Search Udemy courses
      if (platform === 'all' || platform === 'udemy') {
        try {
          udemyCourses = await udemyAPI.searchCourses({
            query,
            page: 1,
            pageSize: 50
          })
        } catch (error) {
          console.error('Error searching Udemy courses:', error)
        }
      }
      
      // Search YouTube courses
      if (platform === 'all' || platform === 'youtube') {
        try {
          youtubeCourses = await searchYouTubeCourses(query || 'programming')
        } catch (error) {
          console.error('Error searching YouTube courses:', error)
        }
      }
      
      // Combine results
      const unifiedCourses: CommonCourse[] = [...udemyCourses, ...youtubeCourses]
      
      // Sort by relevance and popularity
      return this.sortCoursesByRelevance(unifiedCourses, params)
      
    } catch (error) {
      console.error('Error in unified course search:', error)
      return []
    }
  }

  /**
   * Get trending courses from both platforms
   */
  async getTrendingCourses(category?: string): Promise<CommonCourse[]> {
    try {
      const [udemyTrending, youtubeTrending] = await Promise.all([
        udemyAPI.getTrendingCourses(category),
        getYouTubeTrending(category)
      ])
      
      // Combine results
      const unifiedCourses: CommonCourse[] = [...udemyTrending, ...youtubeTrending]
      
      // Sort by popularity
      return unifiedCourses.sort((a, b) => {
        const aPopularity = a.viewCount || a.studentsEnrolled || 0
        const bPopularity = b.viewCount || b.studentsEnrolled || 0
        return bPopularity - aPopularity
      })
      
    } catch (error) {
      console.error('Error getting trending courses:', error)
      return []
    }
  }

  /**
   * Get free courses from both platforms
   */
  async getFreeCourses(query?: string): Promise<CommonCourse[]> {
    try {
      const [udemyFree, youtubeCourses] = await Promise.all([
        udemyAPI.getFreeCourses(query),
        getYouTubeCourses(query || 'programming')
      ])
      
      // Combine results
      const unifiedCourses: CommonCourse[] = [...udemyFree, ...youtubeCourses]
      
      return unifiedCourses
      
    } catch (error) {
      console.error('Error getting free courses:', error)
      return []
    }
  }

  /**
   * Get personalized course recommendations
   */
  async getPersonalizedRecommendations(
    userSkills: string[],
    interests: string[],
    experience: string
  ): Promise<CommonCourse[]> {
    try {
      // Search for courses matching user skills and interests
      const searchQueries = [...userSkills, ...interests]
      const allCourses: CommonCourse[] = []
      
      for (const query of searchQueries.slice(0, 3)) { // Limit to top 3 queries
        const courses = await this.searchCourses({ query })
        allCourses.push(...courses)
      }
      
      // Remove duplicates
      const uniqueCourses = this.removeDuplicateCourses(allCourses)
      
      // Score courses based on user profile
      const scoredCourses = uniqueCourses.map(course => ({
        course,
        score: CourseUtils.calculateCourseScore(course, userSkills, interests, experience)
      }))
      
      // Sort by score and return top recommendations
      return scoredCourses
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map(item => item.course)
      
    } catch (error) {
      console.error('Error getting personalized recommendations:', error)
      return []
    }
  }

  /**
   * Sort courses by relevance
   */
  private sortCoursesByRelevance(courses: CommonCourse[], params: CourseSearchParams): CommonCourse[] {
    return courses.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0
      
      // Platform preference (YouTube for free, Udemy for structured learning)
      if (params.price === 'free') {
        scoreA += a.platform === 'YouTube' ? 2 : 1
        scoreB += b.platform === 'YouTube' ? 2 : 1
      } else {
        scoreA += a.platform === 'Udemy' ? 2 : 1
        scoreB += b.platform === 'Udemy' ? 2 : 1
      }
      
      // Rating preference
      scoreA += a.rating * 10
      scoreB += b.rating * 10
      
      // Popularity preference
      const aPopularity = a.viewCount || a.studentsEnrolled || 0
      const bPopularity = b.viewCount || b.studentsEnrolled || 0
      scoreA += Math.log(aPopularity + 1) * 5
      scoreB += Math.log(bPopularity + 1) * 5
      
      return scoreB - scoreA
    })
  }

  /**
   * Remove duplicate courses
   */
  private removeDuplicateCourses(courses: CommonCourse[]): CommonCourse[] {
    const seen = new Set()
    return courses.filter(course => {
      const key = `${course.title}-${course.instructor}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}

// Export singleton instance
export const unifiedCourseService = new UnifiedCourseService()
