import { createClient } from '@/lib/supabase/server'
import OnboardingForm from '@/components/onboarding/OnboardingForm'
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next: string }>
}) {
  const locale = await getLocale()
  const { next } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return redirect({ href: '/auth/login', locale })

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <OnboardingForm
        user={user}
        next={next}
      />
    </div>
  )
}
