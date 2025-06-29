import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from 'next-intl/server'
import PostHogClient from '@/lib/posthog/posthog-server'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ next: string }>
}) {
  const { next } = await searchParams
  const locale = await getLocale()
  const posthog = PostHogClient()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('User:', user)

  if (!user || !user?.id) {
    throw new Error('User not authenticated')
  }

  // Capture a server-side event with PostHog
  posthog.capture({
    distinctId: user.id,
    event: 'user_logged_in',
    properties: {
      userId: user.id,
      email: user.email,
      locale,
    },
  })

  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user?.id)
    .single()

  if (!existingUser) {
    posthog.capture({
      distinctId: user.id,
      event: 'user_onboarding_started',
      properties: {
        userId: user.id,
        email: user.email,
        locale,
      },
    })

    redirect({
      href: `/onboarding?next=${encodeURIComponent(next)}`,
      locale,
    })
  }

  redirect({ href: next, locale })
}
