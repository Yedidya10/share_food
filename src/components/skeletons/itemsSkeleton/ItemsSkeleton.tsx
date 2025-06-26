import { Skeleton } from '@/components/ui/skeleton'

export default function ItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-64 w-full rounded-2xl"
        />
      ))}
    </div>
  )
}
