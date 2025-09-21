"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  Clock, 
  Users, 
  Star, 
  Zap,
  Search
} from 'lucide-react'
import { CommonCourse, CourseUtils, commonCourseCategories } from '@/lib/common-course-interface'
import { UnifiedCourseButton, UnifiedSearchButton, UnifiedCategoryButton } from '@/components/courses/unified-course-button'

export default function CoursesPage() {
  const [trendingCourses, setTrendingCourses] = useState<CommonCourse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  // Unified flow only


  useEffect(() => {
    loadUnifiedCourses()
  }, [])

  const loadUnifiedCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses/unified?trending=true')
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        // Filter out any invalid courses
        const validCourses = data.data.filter((course: any) => 
          course && 
          course.id && 
          course.title && 
          course.platform
        )
        setTrendingCourses(validCourses)
        toast.success(`Found ${validCourses.length} courses from both platforms`)
      } else {
        console.error('Invalid API response:', data)
        toast.error(data.error || 'Failed to load courses')
      }
    } catch (error) {
      console.error('Error loading unified courses:', error)
              toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  // Removed provider-specific loaders in favor of unified

  const searchCourses = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/courses/unified?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      if (data.success) {
        setTrendingCourses(data.data)
        toast.success(`Found ${data.data.length} courses for "${searchQuery}"`)
      } else {
        toast.error(data.error || 'Failed to search courses')
      }
    } catch (error) {
      console.error('Error searching courses:', error)
      toast.error('Failed to search courses')
    } finally {
      setLoading(false)
    }
  }

  const searchUnifiedCourses = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/courses/unified?query=${encodeURIComponent(searchQuery)}&platform=all`)
      const data = await response.json()
      if (data.success) {
        setTrendingCourses(data.data)
        toast.success(`Found ${data.data.length} courses across both platforms for "${searchQuery}"`)
      } else {
        toast.error(data.error || 'Failed to search courses')
      }
    } catch (error) {
      console.error('Error searching courses:', error)
      toast.error('Failed to search courses')
    } finally {
      setLoading(false)
    }
  }

  // Removed provider-specific search; unified search only

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }
  }

  const getPlatformIcon = (platform: 'YouTube' | 'Udemy') => {
    const platformInfo = CourseUtils.getPlatformInfo(platform)
    return platformInfo.icon
  }

  const getPlatformColor = (platform: 'YouTube' | 'Udemy') => {
    const platformInfo = CourseUtils.getPlatformInfo(platform)
    return platformInfo.color
  }

  const formatCount = (count?: number) => {
    if (!count || isNaN(count)) return '0'
    return CourseUtils.formatCount(count)
  }

  const safeCourseData = (course: CommonCourse) => ({
    id: course.id || `course-${Date.now()}`,
    title: course.title || 'Untitled Course',
    instructor: course.instructor || 'Unknown Instructor',
    description: course.description || 'No description available',
    thumbnail: course.thumbnail || '/placeholder-thumbnail.jpg',
    rating: course.rating || 4.0,
    duration: course.duration || '0:00',
    level: course.level || 'Beginner',
    language: course.language || 'English',
    price: course.price || 'Free',
    category: course.category || 'Programming',
    subcategory: course.subcategory || 'General',
    url: course.url || '#',
    platform: course.platform || 'YouTube',
    lastUpdated: course.lastUpdated || new Date().toISOString(),
    certificate: course.certificate || false,
    features: course.features || [],
    viewCount: course.viewCount || 0,
    studentsEnrolled: course.studentsEnrolled || 0,
    tags: course.tags || ['programming']
  })

  return (
      <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Course Recommendations</h1>
        <p className="text-xl text-muted-foreground">
          Discover the best courses from YouTube and Udemy to advance your skills
        </p>
      </div>

      {/* Platform Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">▶️</span>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">YouTube Courses</h3>
              <p className="text-sm text-red-600 dark:text-red-300">Free video tutorials</p>
            </div>
          </div>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li>• Completely free access</li>
            <li>• Huge variety of content</li>
            <li>• Community-driven learning</li>
            <li>• Click to watch directly on YouTube</li>
          </ul>
        </Card>

        <Card className="p-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎓</span>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Udemy Courses</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">Structured learning with certificates</p>
            </div>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Professional instructors</li>
            <li>• Course certificates</li>
            <li>• Structured learning paths</li>
            <li>• Click to view on Udemy</li>
          </ul>
        </Card>
            </div>

      {/* Unified CTA */}
      <div className="mb-8 flex items-center justify-center">
        <Button
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
          onClick={() => {
            setSearchQuery('')
            loadUnifiedCourses()
          }}
          disabled={loading}
        >
          <Zap className="w-4 h-4 mr-2" />
          Explore Unified Courses
        </Button>
      </div>

      <Tabs defaultValue="unified" className="space-y-8">

        {/* Unified Courses Tab */}
        <TabsContent value="unified" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">All Course Recommendations</h2>
            <p className="text-muted-foreground">
              Browse courses from both YouTube and Udemy in one unified interface
            </p>
          </div>

          {/* Unified Course Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {commonCourseCategories.map((category) => (
              <UnifiedCategoryButton
                key={category.id}
                category={category}
                onClick={() => loadUnifiedCourses()}
              />
            ))}
          </div>

          {/* Unified Course Search */}
          <Card className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search all courses (e.g., React, Python, Web Development)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && searchUnifiedCourses()}
              />
              <UnifiedSearchButton
                loading={loading}
                platform="all"
                onClick={searchUnifiedCourses}
              />
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    loadUnifiedCourses()
                  }}
                  disabled={loading}
                >
                  Clear
                </Button>
              )}
            </div>
          </Card>

          {/* Search Results Summary */}
          {searchQuery && (
            <div className="text-center mb-4">
              <p className="text-muted-foreground">
                Showing {trendingCourses.length} results for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Unified Courses Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCourses.map((course) => {
              const safeCourse = safeCourseData(course)
              return (
                <Card key={safeCourse.id} className="group hover:shadow-lg transition-all duration-300 animate-slide-in-up relative overflow-hidden">
                  {/* Platform Indicator Banner */}
                  <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium text-white ${
                    safeCourse.platform === 'YouTube' 
                      ? 'bg-red-600' 
                      : 'bg-blue-600'
                  }`}>
                    {safeCourse.platform}
                  </div>
                  
                  <CardHeader className="pb-3 pt-8">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getPlatformIcon(safeCourse.platform)}</span>
                        <Badge variant="secondary" className={`text-xs ${getPlatformColor(safeCourse.platform)}`}>
                            {safeCourse.platform}
                          </Badge>
                        </div>

                      </div>
                      <CardTitle className="text-lg line-clamp-2">{safeCourse.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {safeCourse.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {safeCourse.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                        {formatCount(safeCourse.viewCount || safeCourse.studentsEnrolled)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {safeCourse.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getLevelColor(safeCourse.level)}>
                        {safeCourse.level}
                      </Badge>
                      <UnifiedCourseButton
                        course={safeCourse}
                        size="sm"
                        showBookmark={true}
                        showLike={true}
                        showShare={true}
                        loading={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {trendingCourses.length === 0 && (
            <Card className="p-12 text-center">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try searching for specific courses or check back later.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Provider-specific tabs removed for unified experience */}

        {/* Optional advanced features removed for simplicity */}

        {/* Search All */}
        <TabsContent value="search" className="space-y-6 hidden">
          {/* Filters */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select className="w-full p-2 border rounded-md">
                  <option>All Platforms</option>
                  <option>YouTube</option>
                  <option>Udemy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select className="w-full p-2 border rounded-md">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <select className="w-full p-2 border rounded-md">
                  <option>All Prices</option>
                  <option>Free</option>
                  <option>Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select className="w-full p-2 border rounded-md">
                  <option>All Categories</option>
                  {commonCourseCategories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              </div>
            </Card>

          {/* Search Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 animate-slide-in-up">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                        <span className="text-2xl">{getPlatformIcon(course.platform)}</span>
                      <Badge variant="secondary" className={`text-xs ${getPlatformColor(course.platform)}`}>
                          {course.platform}
                      </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                      {formatCount(course.viewCount || course.studentsEnrolled)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                                        <UnifiedCourseButton
                      course={course}
                      size="sm"
                      showBookmark={true}
                      showLike={true}
                      showShare={true}
                      loading={loading}
                    />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}
