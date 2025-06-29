'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Suspense, lazy } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

const LazyCityInput = lazy(() => import('./CityInput'))

type Props<T extends { city: string }> = {
  form: UseFormReturn<T>
}

export default function CityInputWrapper<T extends { city: string }>({
  form,
}: Props<T>) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px', // טיפה לפני שמגיע למסך
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
          <LazyCityInput
            form={form as unknown as UseFormReturn<{ city: string }>}
          />
        </Suspense>
      ) : (
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
      )}
    </div>
  )
}
