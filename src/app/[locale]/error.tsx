'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(error)
    console.error('An error occurred:', error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-muted px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <Alert
          variant="destructive"
          className="text-left"
        >
          <Terminal className="h-4 w-4" />
          <AlertTitle className="font-bold">משהו השתבש</AlertTitle>
          <AlertDescription>
            {'אירעה שגיאה לא צפויה. נסה שוב מאוחר יותר.'}
          </AlertDescription>
        </Alert>

        <Button
          onClick={reset}
          className="w-full"
        >
          נסה שוב
        </Button>
      </div>
    </div>
  )
}
