'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Suspense, lazy } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

const LazyStreetInput = lazy(() => import('./StreetInput'))

type Props<T extends { streetName: string }> = {
  form: UseFormReturn<T>
}

export default function StreetInputWrapper<T extends { streetName: string }>({
  form,
}: Props<T>) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px',
  })

  return (
    <div
      ref={ref}
      className="w-full"
    >
      {inView ? (
        <Suspense
          fallback={
            <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
          }
        >
          <LazyStreetInput
            form={form as unknown as UseFormReturn<{ streetName: string }>}
          />
        </Suspense>
      ) : (
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
      )}
    </div>
  )
}
