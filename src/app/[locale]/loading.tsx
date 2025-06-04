import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className='h-64 w-full rounded-2xl' />
      ))}
    </div>
  );
}
