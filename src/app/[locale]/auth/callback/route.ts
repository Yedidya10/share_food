import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
      const forwardedHost =
        request.headers.get('x-forwarded-host') ?? request.headers.get('host')
      const redirectOrigin = `${forwardedProto}://${forwardedHost}`

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const userId = session?.user?.id

      if (userId) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()

        if (!existingProfile) {
          return NextResponse.redirect(
            `${redirectOrigin}/onboarding?next=${encodeURIComponent(next)}`
          )
        }
      }

      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }
  }

  // If there was an error exchanging the code for a session,
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  const forwardedHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const redirectOrigin = `${forwardedProto}://${forwardedHost}`

  return NextResponse.redirect(`${redirectOrigin}/auth/auth-code-error`)
}
