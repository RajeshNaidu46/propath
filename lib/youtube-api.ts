// YouTube API service for free course recommendations
import { CommonCourse, CourseUtils } from './common-course-interface'

export interface YouTubeCourse {
  id: string
  title: string
  channel: string
  duration: string
  views: string
  thumbnail: string
  url: string
  description: string
  publishedAt: string
  rating: number
  platform?: string
}

export interface CourseCategory {
  id: string
  name: string
  icon: string
  keywords: string[]
}

export const courseCategories: CourseCategory[] = [
  {
    id: "web-development",
    name: "Web Development",
    icon: "💻",
    keywords: ["web development", "javascript", "react", "html css", "frontend", "backend"],
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: "📊",
    keywords: ["data science", "python data", "machine learning", "data analysis", "pandas"],
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    icon: "📱",
    keywords: ["android development", "ios development", "react native", "flutter", "mobile app"],
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    icon: "☁️",
    keywords: ["aws tutorial", "azure tutorial", "google cloud", "docker", "kubernetes"],
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: "📈",
    keywords: ["digital marketing", "seo tutorial", "social media marketing", "google ads"],
  },
  {
    id: "design",
    name: "UI/UX Design",
    icon: "🎨",
    keywords: ["ui ux design", "figma tutorial", "photoshop", "graphic design", "web design"],
  },
]

// YouTube Data API v3 configuration
const YOUTUBE_API_KEY = 'AIzaSyDOpyd6udAQwKSoOW-3jBBIvqwSdwwYAAw'
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// Helper function to format duration from ISO 8601 to readable format
function formatDuration(duration: string): string {
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

// Helper function to format view count
function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount)
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Helper function to calculate rating based on view count and like ratio
function calculateRating(viewCount: string, likeCount?: string): number {
  const views = parseInt(viewCount)
  const likes = likeCount ? parseInt(likeCount) : 0
  
  if (views === 0) return 4.0
  
  // Simple rating algorithm based on views and likes
  const likeRatio = likes / views
  const baseRating = 4.0
  const bonusRating = likeRatio * 1.0
  
  return Math.min(baseRating + bonusRating, 5.0)
}

/**
 * Transform YouTube course data to common interface
 */
function transformToCommonCourse(youtubeCourse: YouTubeCourse): CommonCourse {
  const category = CourseUtils.determineCategory(youtubeCourse.title, youtubeCourse.description)
  
  return {
    id: youtubeCourse.id || `yt-${Date.now()}`,
    title: youtubeCourse.title || 'Untitled Course',
    instructor: youtubeCourse.channel || 'Unknown Instructor',
    description: youtubeCourse.description || 'No description available',
    thumbnail: youtubeCourse.thumbnail || '/placeholder-thumbnail.jpg',
    rating: youtubeCourse.rating || 4.0,
    duration: CourseUtils.formatDuration(youtubeCourse.duration || 'PT0M'),
    level: CourseUtils.determineLevel(youtubeCourse.title || '', youtubeCourse.description || ''),
    language: 'English',
    price: 'Free',
    category: category || 'Programming',
    subcategory: 'Video Tutorial',
    url: youtubeCourse.url || '#',
    lastUpdated: youtubeCourse.publishedAt || new Date().toISOString(),
    certificate: false,
    features: ['Free Access', 'HD Quality', 'Lifetime Access'],
    platform: 'YouTube',
    viewCount: parseInt(youtubeCourse.views) || 0,
    tags: CourseUtils.generateTags(youtubeCourse.title || '', youtubeCourse.description || '', category || 'Programming'),
    lastUpdatedFormatted: new Date(youtubeCourse.publishedAt || Date.now()).toLocaleDateString()
  }
}

/**
 * Internal: call YouTube search API and hydrate with video details
 */
async function fetchYouTubeByQuery(query: string, maxResults: number = 25): Promise<YouTubeCourse[]> {
  try {
    const searchParams = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: Math.min(Math.max(maxResults, 1), 50).toString(),
      relevanceLanguage: 'en',
      safeSearch: 'none',
      videoDuration: 'any'
    })
    const searchUrl = `${YOUTUBE_API_BASE_URL}/search?${searchParams.toString()}`
    const searchResp = await fetch(searchUrl)
    const searchData = await searchResp.json()
    const ids: string[] = (searchData.items || []).map((it: any) => it.id?.videoId).filter(Boolean)
    if (ids.length === 0) return []

    const videosParams = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: 'snippet,contentDetails,statistics',
      id: ids.join(',')
    })
    const videosUrl = `${YOUTUBE_API_BASE_URL}/videos?${videosParams.toString()}`
    const videosResp = await fetch(videosUrl)
    const videosData = await videosResp.json()
    const results: YouTubeCourse[] = (videosData.items || []).map((v: any) => ({
      id: v.id,
      title: v.snippet?.title || '',
      channel: v.snippet?.channelTitle || '',
      duration: v.contentDetails?.duration || 'PT0M',
      views: v.statistics?.viewCount || '0',
      thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.default?.url || '',
      url: `https://www.youtube.com/watch?v=${v.id}`,
      description: v.snippet?.description || '',
      publishedAt: v.snippet?.publishedAt || new Date().toISOString(),
      rating: calculateRating(v.statistics?.viewCount || '0')
    }))
    return results
  } catch (error) {
    console.error('Error fetching YouTube API:', error)
    return []
  }
}

/**
 * Get YouTube courses for a specific category
 */
export async function getYouTubeCourses(category: string = 'programming'): Promise<CommonCourse[]> {
  const base = category.replace(/-/g, ' ')
  const courses = await fetchYouTubeByQuery(`${base} course tutorial`, 25)
  if (courses.length > 0) return courses.map(transformToCommonCourse)
  return getMockYouTubeCourses().map(transformToCommonCourse)
}

/**
 * Search YouTube courses
 */
export async function searchYouTubeCourses(query: string): Promise<CommonCourse[]> {
  const results = await fetchYouTubeByQuery(query, 30)
  if (results.length > 0) return results.map(transformToCommonCourse)
  return getMockYouTubeCourses()
    .filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase())
    )
    .map(transformToCommonCourse)
}

/**
 * Get trending YouTube courses
 */
export async function getTrendingCourses(category?: string): Promise<CommonCourse[]> {
  const query = category ? `${category.replace(/-/g, ' ')} best course` : 'programming tutorial course'
  const results = await fetchYouTubeByQuery(query, 25)
  if (results.length > 0) return results.map(transformToCommonCourse)
  return getMockYouTubeCourses().map(transformToCommonCourse)
}

/**
 * Mock YouTube courses data for fallback and testing
 */
function getMockYouTubeCourses(): YouTubeCourse[] {
  return [
    {
      id: 'yt-12345',
      title: 'Complete Python Tutorial for Beginners',
      channel: 'Programming with Mosh',
      duration: 'PT2H30M',
      views: '1500000',
      thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
      description: 'Learn Python programming from scratch with this comprehensive tutorial for beginners.',
      publishedAt: '2024-01-15T10:00:00Z',
      rating: 4.8
    },
    {
      id: 'yt-67890',
      title: 'React.js Full Course for Beginners',
      channel: 'freeCodeCamp.org',
      duration: 'PT8H15M',
      views: '800000',
      thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      description: 'Learn React.js from scratch with this complete course covering all the fundamentals.',
      publishedAt: '2024-01-10T14:30:00Z',
      rating: 4.7
    },
    {
      id: 'yt-11111',
      title: 'Machine Learning Basics for Beginners',
      channel: 'Sentdex',
      duration: 'PT3H45M',
      views: '500000',
      thumbnail: 'https://img.youtube.com/vi/OGxgnH8y2mY/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=OGxgnH8y2mY',
      description: 'Introduction to machine learning concepts and practical implementation with Python.',
      publishedAt: '2024-01-08T16:00:00Z',
      rating: 4.6
    }
  ]
}
