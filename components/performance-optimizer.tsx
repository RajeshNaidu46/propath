"use client"

import { useEffect, useCallback } from 'react'

interface PerformanceOptimizerProps {
  children: React.ReactNode
}

export function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  // Preload critical routes
  const preloadRoutes = useCallback(() => {
    const criticalRoutes = ['/resume', '/assessments', '/courses', '/chat']
    
    criticalRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }, [])

  // Optimize images with lazy loading
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img:not([loading])')
    images.forEach(img => {
      img.setAttribute('loading', 'lazy')
    })
  }, [])

  useEffect(() => {
    // Run optimizations after component mount
    const timer = setTimeout(() => {
      preloadRoutes()
      optimizeImages()
    }, 1000) // Delay to avoid blocking initial render

    return () => clearTimeout(timer)
  }, [preloadRoutes, optimizeImages])

  return <>{children}</>
}