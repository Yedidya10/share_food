'use server'

import { createClient } from '@/lib/supabase/server'

export async function insertAddressToProfile({
  streetName,
  streetNumber,
  city,
  country,
  postalCode,
}: {
  streetName: string
  streetNumber: string
  city: string
  country: string
  postalCode: string
}) {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      throw userError
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        main_address: {
          street_name: streetName,
          street_number: streetNumber,
          city: city,
          country: country,
          postal_code: postalCode.trim(),
        },
      })
      .eq('id', userData.user.id)
      .select('main_address')

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error('No profile found to update')
    }

    return {
      success: true,
      message: 'Address updated successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
