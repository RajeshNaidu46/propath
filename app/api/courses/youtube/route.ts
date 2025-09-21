import { NextRequest, NextResponse } from 'next/server'
import { getYouTubeCourses, searchYouTubeCourses, getTrendingCourses, YouTubeCourse } from '@/lib/youtube-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const query = searchParams.get('query')
    const trending = searchParams.get('trending')

    let courses: YouTubeCourse[] = []

    if (trending === 'true') {
      // Get trending courses from multiple categories
      const [webDevTrending, dataScienceTrending] = await Promise.all([
        getTrendingCourses('web-development'),
        getTrendingCourses('data-science')
      ])
      courses = [...webDevTrending, ...dataScienceTrending]
    } else if (category) {
      // Get courses by category
      courses = await getYouTubeCourses(category)
    } else if (query) {
      // Search courses by query
      courses = await searchYouTubeCourses(query)
    } else {
      // Get courses from default category (web development)
      courses = await getYouTubeCourses('web-development')
    }

    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length,
      timestamp: new Date().toISOString(),
      source: 'YouTube Data API v3'
    })

  } catch (error) {
    console.error('Error in YouTube courses API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch YouTube courses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, category, maxResults = 20 } = body

    if (!query && !category) {
      return NextResponse.json(
        { error: 'Either query or category is required' },
        { status: 400 }
      )
    }

    let courses: YouTubeCourse[] = []

    if (query) {
      courses = await searchYouTubeCourses(query)
    } else if (category) {
      courses = await getYouTubeCourses(category)
    }

    // Limit results if specified
    if (maxResults && maxResults < courses.length) {
      courses = courses.slice(0, maxResults)
    }

    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length,
      timestamp: new Date().toISOString(),
      source: 'YouTube Data API v3'
    })

  } catch (error) {
    console.error('Error in YouTube courses API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch YouTube courses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
