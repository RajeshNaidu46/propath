import { NextRequest, NextResponse } from 'next/server'
import { apyfluxJobsAPI } from '@/lib/apyflux-jobs-api'
import { linkedInJobsAPI } from '@/lib/linkedin-jobs-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const location = searchParams.get('location')
    const experience = searchParams.get('experience')
    const type = searchParams.get('type')
    const industry = searchParams.get('industry')
    const trending = searchParams.get('trending')
    const company = searchParams.get('company')
    const test = searchParams.get('test')

    // Test endpoint to check API response structure
    if (test === 'true') {
      const testData = await apyfluxJobsAPI.testAPI()
      return NextResponse.json({
        success: true,
        data: testData,
        message: 'API test completed - check console for response structure'
      })
    }

    // Fetch jobs from multiple platforms concurrently
    const fetchPromises = []

    // Prepare search parameters for both APIs
    const jobSearchParams = {
      query: query || undefined,
      location: location || undefined,
      experience: experience || undefined,
      type: type || undefined,
      industry: industry || undefined,
      limit: 25 // Split limit between APIs
    }

    if (trending === 'true') {
      // Fetch trending jobs from both APIs
      fetchPromises.push(
        apyfluxJobsAPI.getTrendingJobs(industry || undefined).catch(err => {
          console.error('Error fetching from Apyflux trending:', err)
          return []
        })
      )
      fetchPromises.push(
        linkedInJobsAPI.getTrendingJobs(industry || undefined).catch(err => {
          console.error('Error fetching from LinkedIn trending:', err)
          return []
        })
      )
    } else if (company) {
      // Fetch company jobs from both APIs
      fetchPromises.push(
        apyfluxJobsAPI.getJobsByCompany(company).catch(err => {
          console.error('Error fetching from Apyflux company:', err)
          return []
        })
      )
      fetchPromises.push(
        linkedInJobsAPI.getJobsByCompany(company).catch(err => {
          console.error('Error fetching from LinkedIn company:', err)
          return []
        })
      )
    } else if (query || location || experience || type || industry) {
      // Search jobs from both APIs
      fetchPromises.push(
        apyfluxJobsAPI.searchJobs(jobSearchParams).catch(err => {
          console.error('Error searching Apyflux:', err)
          return []
        })
      )
      fetchPromises.push(
        linkedInJobsAPI.searchJobs(jobSearchParams).catch(err => {
          console.error('Error searching LinkedIn:', err)
          return []
        })
      )
    } else {
      // Default: get trending jobs from both APIs
      fetchPromises.push(
        apyfluxJobsAPI.getTrendingJobs().catch(err => {
          console.error('Error fetching from Apyflux default:', err)
          return []
        })
      )
      fetchPromises.push(
        linkedInJobsAPI.getTrendingJobs().catch(err => {
          console.error('Error fetching from LinkedIn default:', err)
          return []
        })
      )
    }

    // Wait for all API calls to complete
    const results = await Promise.all(fetchPromises)

    // Combine all job results
    let allJobs = results.flat()

    // Remove duplicates based on application URL or title+company combination
    const seen = new Set()
    allJobs = allJobs.filter(job => {
      const key = job.applicationUrl || `${job.title}-${job.company}`.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })

    // Sort by posted date (most recent first)
    allJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())

    // Limit total results to 50
    const jobs = allJobs.slice(0, 50)

    return NextResponse.json({
      success: true,
      data: jobs,
      total: jobs.length,
      timestamp: new Date().toISOString(),
      source: 'Multiple Job Platforms (Apyflux + LinkedIn)'
    })

  } catch (error) {
    console.error('Error in jobs API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userSkills, targetRole, experience, location } = body

    if (!userSkills || !Array.isArray(userSkills) || userSkills.length === 0) {
      return NextResponse.json(
        { error: 'User skills array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json(
        { error: 'Target role is required' },
        { status: 400 }
      )
    }

    const recommendations = await apyfluxJobsAPI.getJobRecommendations(
      userSkills,
      targetRole,
      experience || 'mid-level',
      location
    )

    return NextResponse.json({
      success: true,
      data: recommendations,
      total: recommendations.length,
      timestamp: new Date().toISOString(),
      source: 'Apyflux Jobs API'
    })

  } catch (error) {
    console.error('Error in job recommendations API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get job recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
