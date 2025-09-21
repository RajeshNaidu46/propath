import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, Play, GraduationCap, Loader2, Heart, Share2 } from 'lucide-react'
import { CommonCourse } from '@/lib/common-course-interface'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface UnifiedCourseButtonProps {
  course: CommonCourse
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showBookmark?: boolean
  showLike?: boolean
  showShare?: boolean
  className?: string
  onClick?: () => void
  loading?: boolean
}

export function UnifiedCourseButton({
  course,
  variant = 'default',
  size = 'default',
  showBookmark = false,
  showLike = false,
  showShare = false,
  className = '',
  onClick,
  loading = false
}: UnifiedCourseButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const isYouTube = course.platform === 'YouTube'
  const isUdemy = course.platform === 'Udemy'
  
  // Enhanced button styling based on platform
  const getButtonStyle = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return className
    }
    
    if (isYouTube) {
      return `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
    } else if (isUdemy) {
      return `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
    }
    
    // Enhanced unified gradient for mixed platforms
    return `bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
  }

  // Enhanced platform-specific icon and text
  const getButtonContent = () => {
    if (loading || isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      )
    }
    
    if (isYouTube) {
      return (
        <>
          <Play className="w-4 h-4 mr-2" />
          Watch on YouTube
        </>
      )
    } else if (isUdemy) {
      return (
        <>
          <GraduationCap className="w-4 h-4 mr-2" />
          View Course
        </>
      )
    }
    
    return (
      <>
        <ExternalLink className="w-4 h-4 mr-2" />
        View Course
      </>
    )
  }

  const handleClick = async (e?: React.MouseEvent) => {
    if (onClick) {
      onClick()
      return
    }
    // If no valid URL, prevent navigation and show feedback
    const hasValidUrl = Boolean(course.url && course.url !== '#' && /^https?:\/\//i.test(course.url))
    if (!hasValidUrl) {
      e?.preventDefault()
      toast.error('Course URL not available')
      return
    }
    // Optional lightweight loading feedback (no window.open here since <a> handles navigation)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 400)
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
    // TODO: Implement actual bookmark functionality with backend
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from likes' : 'Added to likes')
    // TODO: Implement actual like functionality with backend
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (navigator.share) {
        await navigator.share({
          title: course.title,
          text: `Check out this ${course.platform} course: ${course.title}`,
          url: course.url
        })
      } else {
        await navigator.clipboard.writeText(course.url)
        toast.success('Course link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share course')
    }
  }

  return (
    <div className="flex items-center gap-2">
      {showShare && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          onClick={handleShare}
          title="Share course"
        >
          <Share2 className="w-4 h-4 text-blue-600" />
        </Button>
      )}
      
      {showLike && (
        <Button 
          variant="ghost" 
          size="sm" 
          className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isLiked 
              ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20' 
              : 'hover:bg-red-100 dark:hover:bg-red-900/20'
          }`}
          onClick={handleLike}
          title={isLiked ? 'Remove from likes' : 'Add to likes'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
      )}
      
      {showBookmark && (
        <Button 
          variant="ghost" 
          size="sm" 
          className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isBookmarked 
              ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20' 
              : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
          }`}
          onClick={handleBookmark}
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      )}
      
      <a
        href={course.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex"
      >
        <Button
          variant={variant}
          size={size}
          className={getButtonStyle()}
          disabled={loading || isLoading}
        >
          {getButtonContent()}
        </Button>
      </a>
    </div>
  )
}

// Enhanced search button variants for specific use cases
export function UnifiedSearchButton({
  loading,
  platform,
  onClick,
  className = ''
}: {
  loading: boolean
  platform?: 'all' | 'youtube' | 'udemy'
  onClick: () => void
  className?: string
}) {
  const getSearchButtonStyle = () => {
    if (platform === 'youtube') {
      return `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
    } else if (platform === 'udemy') {
      return `bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
    }
    // Enhanced unified search
    return `bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`
  }

  const getSearchButtonText = () => {
    if (loading) return 'Searching...'
    if (platform === 'youtube') return 'Search YouTube'
    if (platform === 'udemy') return 'Search Udemy'
    return 'Search All'
  }

  const getSearchButtonIcon = () => {
    if (loading) {
      return <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    }
    if (platform === 'youtube') {
      return <Play className="w-4 h-4 mr-2" />
    }
    if (platform === 'udemy') {
      return <GraduationCap className="w-4 h-4 mr-2" />
    }
    return <ExternalLink className="w-4 h-4 mr-2" />
  }

  return (
    <Button 
      onClick={onClick}
      disabled={loading}
      className={getSearchButtonStyle()}
    >
      {getSearchButtonIcon()}
      {getSearchButtonText()}
    </Button>
  )
}

// Enhanced category button with better animations
export function UnifiedCategoryButton({
  category,
  onClick,
  isActive = false,
  className = ''
}: {
  category: { id: string; name: string; icon: string }
  onClick: () => void
  isActive?: boolean
  className?: string
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg' 
          : 'hover:bg-primary hover:text-primary-foreground hover:shadow-md'
      } ${className}`}
      onClick={onClick}
    >
      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{category.icon}</span>
      <span className="text-xs text-center font-medium">{category.name}</span>
    </Button>
  )
}

// New comprehensive unified course widget
export function UnifiedCourseWidget({
  course,
  showActions = true,
  showStats = true,
  className = ''
}: {
  course: CommonCourse
  showActions?: boolean
  showStats?: boolean
  className?: string
}) {
  const isYouTube = course.platform === 'YouTube'
  const isUdemy = course.platform === 'Udemy'
  
  const getPlatformGradient = () => {
    if (isYouTube) {
      return 'from-red-500 to-red-600'
    } else if (isUdemy) {
      return 'from-blue-500 to-blue-600'
    }
    return 'from-blue-500 via-purple-500 to-pink-500'
  }

  const getPlatformIcon = () => {
    if (isYouTube) return '▶️'
    if (isUdemy) return '🎓'
    return '📚'
  }

  const getPlatformColor = () => {
    if (isYouTube) return 'text-red-600'
    if (isUdemy) return 'text-blue-600'
    return 'text-purple-600'
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Platform Banner */}
      <div className={`bg-gradient-to-r ${getPlatformGradient()} p-3 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPlatformIcon()}</span>
            <span className="font-semibold">{course.platform}</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {course.level}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
          <span>👨‍🏫 {course.instructor}</span>
          <span>⭐ {course.rating}</span>
          <span>⏱️ {course.duration}</span>
        </div>

        {showStats && (
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {isYouTube ? course.viewCount?.toLocaleString() || '0' : course.studentsEnrolled?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isYouTube ? 'Views' : 'Students'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {course.price}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Price
              </div>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex items-center gap-2">
            <UnifiedCourseButton
              course={course}
              size="sm"
              showBookmark={true}
              showLike={true}
              showShare={true}
              className="flex-1"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// New unified platform selector
export function UnifiedPlatformSelector({
  selectedPlatform,
  onPlatformChange,
  className = ''
}: {
  selectedPlatform: 'all' | 'youtube' | 'udemy'
  onPlatformChange: (platform: 'all' | 'youtube' | 'udemy') => void
  className?: string
}) {
  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐', color: 'from-blue-500 via-purple-500 to-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'from-red-500 to-red-600' },
    { id: 'udemy', name: 'Udemy', icon: '🎓', color: 'from-blue-500 to-blue-600' }
  ] as const

  return (
    <div className={`flex gap-2 ${className}`}>
      {platforms.map((platform) => (
        <Button
          key={platform.id}
          variant={selectedPlatform === platform.id ? "default" : "outline"}
          className={`flex items-center gap-2 transition-all duration-300 ${
            selectedPlatform === platform.id
              ? `bg-gradient-to-r ${platform.color} text-white shadow-lg`
              : 'hover:shadow-md'
          }`}
          onClick={() => onPlatformChange(platform.id)}
        >
          <span className="text-lg">{platform.icon}</span>
          <span className="hidden sm:inline">{platform.name}</span>
        </Button>
      ))}
    </div>
  )
}
