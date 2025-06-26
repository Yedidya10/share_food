'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { render } from '@react-email/render'
import WelcomeEmail from '@/components/emailTemplates/welcomeEmail/WelcomeEmail'
import type { Session, User } from '@supabase/supabase-js'

const LOCALSTORAGE_KEY = 'welcome_email_sent'

// Helper to parse full_name into first and last name
function parseName(fullName?: string): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: '', lastName: '' }
  const [firstName = '', lastName = ''] = fullName.split(' ')
  return { firstName, lastName }
}

export default function WelcomeEmailEffect() {
  useEffect(() => {
    const supabase = createClient()

    async function sendWelcomeEmail(user: User): Promise<boolean> {
      try {
        const { firstName } = parseName(user.user_metadata?.full_name)
        const userName = firstName || 'משתמש יקר'

        const html = await render(
          <WelcomeEmail
            userName={userName}
            steps={[]}
            links={[
              { href: 'https://sparebite.com', title: 'בקר באתר SpareBite' },
            ]}
          />,
        )

        const res = await fetch('/api/send-welcome-oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, html }),
        })

        if (!res.ok) {
          console.error('Failed to send welcome email:', res.statusText)
          return false
        }

        const data = await res.json()
        if (!data.success) {
          console.error('Failed to send welcome email:', data.message)
          return false
        }
        return true
      } catch (err) {
        console.error('Failed to send welcome email:', err)
        return false
      }
    }

    async function handleUser(session: Session) {
      const user = session.user
      if (!user) return

      if (typeof window !== 'undefined') {
        const localSent = localStorage.getItem(LOCALSTORAGE_KEY)
        if (localSent === user.id) {
          return
        }
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, welcome_email_sent')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError)
        return
      }

      if (!profile) {
        const { firstName, lastName } = parseName(user.user_metadata?.full_name)
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          first_name: firstName,
          last_name: lastName,
          phone: user.phone ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          welcome_email_sent: false,
        })

        if (insertError) {
          console.error('Error inserting profile:', insertError)
          return
        }
      }

      if (!profile || !profile.welcome_email_sent) {
        const isSent = await sendWelcomeEmail(user)

        if (!isSent) {
          console.error('Failed to send welcome email.')
          return
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            welcome_email_sent: true,
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Failed to mark welcome email as sent:', updateError)
        } else {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCALSTORAGE_KEY, user.id)
          }
        }
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            handleUser(session) // async
          }, 0)
        }
      },
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])
  return null
}
