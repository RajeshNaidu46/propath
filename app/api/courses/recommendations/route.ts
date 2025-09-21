import { NextRequest, NextResponse } from 'next/server'
import { unifiedCourseService } from '@/lib/unified-course-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skills, targetRole, experienceLevel } = body

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'Skills array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json(
        { error: 'Target role is required' },
        { status: 400 }
      )
    }

    // Use the unified course service for personalized recommendations
    const recommendations = await unifiedCourseService.getPersonalizedRecommendations(
      skills,
      [targetRole], // Use target role as an interest
      experienceLevel || 'mid-level'
    )

    return NextResponse.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString(),
      totalRecommendations: recommendations.length,
      platforms: [
        'YouTube',
        'Udemy',
        'Coursera',
        'edX',
        'Khan Academy',
        'MIT OpenCourseware',
        'Stanford Online',
        'Harvard Online',
        'FreeCodeCamp',
        'The Odin Project',
        'MDN Web Docs'
      ]
    })

  } catch (error) {
    console.error('Error in course recommendations API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get course recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const trending = searchParams.get('trending')

    if (trending === 'true') {
      const trendingCourses = await unifiedCourseService.getTrendingCourses(category || undefined)
      return NextResponse.json({
        success: true,
        data: trendingCourses,
        timestamp: new Date().toISOString()
      })
    }

    if (category) {
      // Get courses by category
      const courses = await unifiedCourseService.searchCourses({ query: category })
      return NextResponse.json({
        success: true,
        data: courses,
        timestamp: new Date().toISOString()
      })
    }

    // Return available categories
    const categories = [
      'Programming',
      'Web Development',
      'Data Science',
      'Machine Learning',
      'Mobile Development',
      'DevOps',
      'Design',
      'Business',
      'Marketing',
      'Finance'
    ]
    
    return NextResponse.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in course categories API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get course categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
