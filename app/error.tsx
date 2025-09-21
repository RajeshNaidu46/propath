'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Bug className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
          <CardDescription className="text-lg">
            We're sorry, but something unexpected happened. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error.message && (
            <div className="p-4 bg-muted rounded-lg border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Error Details:</p>
              <p className="text-sm font-mono text-destructive break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Try these steps to resolve the issue:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Refresh the page</li>
              <li>• Clear your browser cache</li>
              <li>• Check your internet connection</li>
              <li>• Try again in a few minutes</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If the problem persists, please contact support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
