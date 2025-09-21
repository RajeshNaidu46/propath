import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            Sorry, we couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            The page you requested might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              You can try:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Double-check the URL for typos</li>
              <li>• Use the navigation menu above</li>
              <li>• Go back to the previous page</li>
              <li>• Return to the homepage</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please contact support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
