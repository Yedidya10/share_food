'use server'

import { z } from 'zod'
// Define your form schema using Zod
import postItemSchema from '@/lib/zod/item/postItemSchema/postItemSchema'
import { createClient } from '@/lib/supabase/server'

type PostItemFormSchema = z.infer<ReturnType<typeof postItemSchema>>

export default async function updateUserAddress(values: PostItemFormSchema) {
  try {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Session error:', JSON.stringify(userError, null, 2))
      return
    }
    const userId = userData?.user?.id

    const { error: insertError } = await supabase
      .from('profiles')
      .update({
        main_address: {
          street_name: values.streetName,
          street_number: values.streetNumber,
          city: values.city,
          country: values.country,
          postal_code: values.postalCode,
        },
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
