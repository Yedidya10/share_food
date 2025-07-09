import Image from 'next/image'
import { Database } from '@/types/supabase-fixed'

export default function ItemPreviewMessage({
  item,
}: {
  item: Database['public']['Views']['active_items']['Row']
}) {
  return (
    <div className="self-center w-full max-w-md mb-2">
      <div className="border rounded-xl p-3 bg-muted/50 flex gap-4">
        <Image
          src={item.images?.[0] ?? '/placeholder.png'}
          alt={item.title}
          width={64}
          height={64}
          className="w-16 h-16 rounded-lg object-cover border"
        />
        <div className="flex-1">
          <div className="text-sm font-medium line-clamp-1">{item.title}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {item.description || 'אין תיאור'}
          </div>
        </div>
      </div>
    </div>
  )
}
