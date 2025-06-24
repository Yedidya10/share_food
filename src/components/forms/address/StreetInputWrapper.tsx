"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";

const LazyStreetInput = lazy(() => import("./StreetInput"));

export default function StreetInputWrapper(
  props: React.ComponentProps<typeof LazyStreetInput>
) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "50px",
  });

  return (
    <div ref={ref} className='w-full'>
      {inView ? (
        <Suspense
          fallback={
            <Skeleton className='h-10 w-full bg-gray-200 dark:bg-gray-700' />
          }
        >
          <LazyStreetInput {...props} />
        </Suspense>
      ) : (
        <Skeleton className='h-10 w-full bg-gray-200 dark:bg-gray-700' />
      )}
    </div>
  );
}
