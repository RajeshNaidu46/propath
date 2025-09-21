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
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDOpyd6udAQwKSoOW-3jBBIvqwSdwwYAAw'
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// ... rest of the file unchanged ...