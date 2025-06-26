import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from 'next-intl/server'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ next: string }>
}) {
  const { next } = await searchParams
  const locale = await getLocale()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('User:', user)

  // if (!user) {
  //   redirect({ href: '/auth/login', locale })
  // }

  // בדוק אם המשתמש חדש (למשל שדה custom או שאילתא)
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user?.id)
    .single()

  if (!existingUser) {
    redirect({
      href: `/onboarding?next=${encodeURIComponent(next)}`,
      locale,
    })
  }

  redirect({ href: next, locale })
}
