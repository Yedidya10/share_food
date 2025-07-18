'use client'

import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import { CredentialResponse } from 'google-one-tap'
import { useEffect } from 'react'
import { toast } from 'sonner'
import posthog from 'posthog-js'
import { googleConfig } from '@/lib/envConfig'

const OneTapComponent = () => {
  const supabase = createClient()

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    )
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return [nonce, hashedNonce]
  }

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      window.addEventListener('load', async () => {
        const [nonce, hashedNonce] = await generateNonce()

        // check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session', error)
        }
        if (data.session) {
          return
        }

        /* global google */
        google.accounts.id.initialize({
          client_id: googleConfig.clientId,
          callback: async (response: CredentialResponse) => {
            try {
              // send id token returned in response.credential to supabase
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              })

              if (error) {
                toast.error('Google One Tap sign-in failed:', {
                  description: error.message,
                })
              }

              // If sign-in is successful, you can redirect or perform other actions
              if (data.session) {
                posthog.identify(data.session.user.id, {
                  email: data.session.user.email,
                  fullName: data.session.user.user_metadata?.full_name,
                  firstName:
                    data.session.user.user_metadata?.full_name?.split(' ')[0],
                  lastName:
                    data.session.user.user_metadata?.full_name?.split(' ')[1],
                })
              }
            } catch (error) {
              console.error('Error logging in with Google One Tap', error)
              toast.error('Google One Tap sign-in failed. Please try again.')
            }
          },
          nonce: hashedNonce,
          // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: true,
        })
        google.accounts.id.prompt() // Display the One Tap UI
      })
    }
    initializeGoogleOneTap()
    return () => window.removeEventListener('load', initializeGoogleOneTap)
  }, [, supabase.auth])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div
        id="oneTap"
        className="fixed top-0 right-0 z-[100]"
      />
    </>
  )
}

export default OneTapComponent
