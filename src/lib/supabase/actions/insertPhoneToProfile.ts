'use server'

import { createClient } from '@/lib/supabase/server'

export async function insertPhoneToProfile({
  phoneNumber,
  isHaveWhatsApp,
}: {
  phoneNumber: string
  isHaveWhatsApp: boolean
}) {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      throw userError
    }

    const { data: dataPhone, error: errorPhone } = await supabase
      .from('profiles')
      .update({ phone_number: phoneNumber })
      .eq('id', userData.user.id)
      .select('id, phone_number')

    if (errorPhone) {
      throw errorPhone
    }

    if (!dataPhone) {
      throw new Error('No profile found to update')
    }

    const { data: dataWhatsApp, error: errorWhatsApp } = await supabase
      .from('profiles')
      .update({ is_have_whatsapp: isHaveWhatsApp })
      .eq('id', userData.user.id)
      .select('id, is_have_whatsapp')

    if (errorWhatsApp) {
      throw errorWhatsApp
    }

    if (!dataWhatsApp) {
      throw new Error('No profile found to update WhatsApp status')
    }

    return {
      success: true,
      message: 'Phone number and WhatsApp status updated successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
