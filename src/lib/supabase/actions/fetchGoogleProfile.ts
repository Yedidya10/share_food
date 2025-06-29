'use server'

import { createClient } from '@/lib/supabase/server'

export default async function fetchGoogleProfile() {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const accessToken = session?.provider_token

    const res = await fetch(
      'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers,addresses',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error('Failed to fetch from Google')

    const data = await res.json()
    console.log('Google profile data:', data)

    return {
      phone: data.phoneNumbers?.[0]?.value || '',
      address: {
        city: data.addresses?.[0]?.city || '',
        street: data.addresses?.[0]?.streetAddress || '',
        number: data.addresses?.[0]?.extendedAddress || '',
      },
    }
  } catch (error) {
    console.error('Error fetching Google profile:', error)
    return {
      phone: '',
      address: {
        city: '',
        street: '',
        number: '',
      },
    }
  }
}
