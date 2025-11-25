'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Admin error:', error)
  }, [error])

  const isAuthError = error.message.includes('Unauthorized') || error.message.includes('auth')

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            {isAuthError
              ? 'You need to be authenticated to access this page.'
              : 'An unexpected error occurred.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthError && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Error details:</p>
              <p className="text-muted-foreground mt-1">{error.message}</p>
            </div>
          )}
          <div className="flex gap-2">
            {isAuthError ? (
              <Button onClick={() => (window.location.href = '/login')} className="w-full">
                Go to Login
              </Button>
            ) : (
              <>
                <Button onClick={reset} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => (window.location.href = '/admin/dashboard')} className="flex-1">
                  Go to Dashboard
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

