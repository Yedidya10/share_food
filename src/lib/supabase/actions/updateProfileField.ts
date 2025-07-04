'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Updates a specific field in the user's profile.
 * @param fieldUpdate - The field to update in the user's profile.
 */

export default async function updateProfileField({
  field,
  value,
}: {
  field: string
  value: string
}) {
  try {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Session error:', JSON.stringify(userError, null, 2))
      throw new Error('User not authenticated')
    }

    const userId = userData?.user?.id
    if (!userId) {
      console.error('User ID not found in session data')
      throw new Error('User ID not found')
    }

    const { error: insertError } = await supabase
      .from('profiles')
      .update({
        [field]: value,
      })
      .eq('id', userId)

    if (insertError) {
      return {
        success: false,
        message: `Error inserting item: ${insertError.message}`,
      }
    } else {
      return {
        success: true,
        message: 'Item inserted successfully',
      }
    }
  } catch (error) {
    console.error(error)
  }
}
