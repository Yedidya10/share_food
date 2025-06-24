"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";

const LazyCityInput = lazy(() => import("./CityInput"));

export default function CityInputWrapper(
  props: React.ComponentProps<typeof LazyCityInput>
) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "50px", // טיפה לפני שמגיע למסך
  });

  return (
    <div ref={ref} className='w-full'>
      {inView ? (
        <Suspense
          fallback={
            <Skeleton className='h-10 w-full bg-gray-200 dark:bg-gray-700' />
          }
        >
          <LazyCityInput {...props} />
        </Suspense>
      ) : (
        <Skeleton className='h-10 w-full bg-gray-200 dark:bg-gray-700' />
      )}
    </div>
  );
}
