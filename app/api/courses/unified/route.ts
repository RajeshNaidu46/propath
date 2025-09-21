import { NextRequest, NextResponse } from 'next/server'
import { unifiedCourseService } from '@/lib/unified-course-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const platform = searchParams.get('platform') as 'udemy' | 'youtube' | 'all' | null
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const price = searchParams.get('price') as 'free' | 'paid' | 'all' | null
    const trending = searchParams.get('trending')
    const free = searchParams.get('free')
    const personalized = searchParams.get('personalized')
    const userSkills = searchParams.get('userSkills')
    const interests = searchParams.get('interests')
    const experience = searchParams.get('experience')

    let courses = []

    if (personalized === 'true' && userSkills && interests && experience) {
      // Get personalized recommendations
      const skillsArray = userSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      const interestsArray = interests.split(',').map(interest => interest.trim()).filter(Boolean)
      
      courses = await unifiedCourseService.getPersonalizedRecommendations(
        skillsArray,
        interestsArray,
        experience
      )
    } else if (trending === 'true') {
      // Get trending courses
      courses = await unifiedCourseService.getTrendingCourses(category || undefined)
    } else if (free === 'true') {
      // Get free courses
      courses = await unifiedCourseService.getFreeCourses(query || undefined)
    } else if (query) {
      // Search courses
      courses = await unifiedCourseService.searchCourses({
        query,
        platform: platform || 'all',
        level: level || undefined,
        category: category || undefined,
        price: price || 'all'
      })
    } else {
      // Default: get trending courses
      courses = await unifiedCourseService.getTrendingCourses()
    }

    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length,
      timestamp: new Date().toISOString(),
      source: 'Unified Course Service (Udemy + YouTube)'
    })

  } catch (error) {
    console.error('Error in unified courses API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch courses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userSkills, interests, experience, query, platform, level, category, price } = body

    if (!userSkills || !Array.isArray(userSkills) || userSkills.length === 0) {
      return NextResponse.json(
        { error: 'User skills array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { error: 'User interests array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!experience || typeof experience !== 'string') {
      return NextResponse.json(
        { error: 'Experience level is required' },
        { status: 400 }
      )
    }

    let courses = []

    if (query) {
      // Search with user preferences
      courses = await unifiedCourseService.searchCourses({
        query,
        platform: platform || 'all',
        level: level || undefined,
        category: category || undefined,
        price: price || 'all'
      })
    } else {
      // Get personalized recommendations
      courses = await unifiedCourseService.getPersonalizedRecommendations(
        userSkills,
        interests,
        experience
      )
    }

    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length,
      timestamp: new Date().toISOString(),
      source: 'Unified Course Service (Udemy + YouTube)'
    })

  } catch (error) {
    console.error('Error in unified courses API POST:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get course recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
