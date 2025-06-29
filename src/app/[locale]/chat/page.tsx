// src/app/[locale]/chat/page.tsx
import InboxClient from '@/components/chat/inboxClient/InboxClient'
import { createClient } from '@/lib/supabase/server'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    throw new Error('User not authenticated')
  }

  return (
    <>
      {/* Desktop view for InboxClient */}
      <div className="hidden md:flex flex-col items-center justify-center h-full flex-1">
        <p className="text-lg font-medium mb-4">
          לחץ על שיחה בצד ימין כדי להתחיל לשוחח.
        </p>
      </div>

      {/* Mobile view for InboxClient */}
      <div className="flex md:hidden w-full">
        <InboxClient />
      </div>
    </>
  )
}
