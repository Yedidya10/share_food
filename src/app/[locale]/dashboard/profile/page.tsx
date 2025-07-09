import ProfileCard from '@/components/profileCard/ProfileCard'
import { createClient } from '@/lib/supabase/server'
import { FixedProfile } from '@/types/supabase-fixed'
import { getTranslations } from 'next-intl/server'

export default async function ProfilePage() {
  const tFormGeneric = await getTranslations('form.generic')
  const tFormToast = await getTranslations('form.toast')
  const tFormContactDetails = await getTranslations('form.contact_details')
  const tFormAddress = await getTranslations('form.address')

  const genericTranslations = {
    submitButton: tFormGeneric('submit_button'),
    submitButtonProcessing: tFormGeneric('submit_button_processing'),
    cancel: tFormGeneric('cancel'),
    required: tFormGeneric('required'),
    reset: tFormGeneric('reset'),
  }

  // Toast translations
  const toastTranslations = {
    userNameUpdated: tFormToast('user_name_updated'),
    userNameUpdateFailed: tFormToast('user_name_update_failed'),
    addressUpdated: tFormToast('address_updated'),
    phoneUpdated: tFormToast('phone_updated'),
    emailUpdated: tFormToast('email_updated'),
    AddressUpdateFailed: tFormToast('address_update_failed'),
    PhoneUpdateFailed: tFormToast('phone_update_failed'),
    EmailUpdateFailed: tFormToast('email_update_failed'),
  }

  const addressTranslations = {
    addressDetails: tFormAddress('address_details'),
    noAddressProvided: tFormAddress('no_address_provided'),
    streetName: tFormAddress('street_name'),
    streetNumber: tFormAddress('street_number'),
    city: tFormAddress('city'),
    country: tFormAddress('country'),
    postalCode: tFormAddress('postal_code'),
    streetNamePlaceholder: tFormAddress('street_name_placeholder'),
    streetNameError: tFormAddress('street_name_error'),
    streetNumberPlaceholder: tFormAddress('street_number_placeholder'),
    streetNumberError: tFormAddress('street_number_error'),
    cityPlaceholder: tFormAddress('city_placeholder'),
    cityError: tFormAddress('city_error'),
    countryPlaceholder: tFormAddress('country_placeholder'),
    countryError: tFormAddress('country_error'),
    postalCodePlaceholder: tFormAddress('postal_code_placeholder'),
    postalCodeError: tFormAddress('postal_code_error'),
  }

  // Email translations
  const emailTranslations = {
    email: tFormContactDetails('email'),
    emailPlaceholder: tFormContactDetails('email_placeholder'),
    emailError: tFormContactDetails('email_error'),
  }

  // Phone translations
  const phoneTranslations = {
    phoneNumber: tFormContactDetails('phone_number'),
    noPhoneNumberProvided: tFormContactDetails('no_phone_number_provided'),
    phoneNumberPlaceholder: tFormContactDetails('phone_number_placeholder'),
    phoneNumberError: tFormContactDetails('phone_number_error'),
    isHaveWhatsApp: tFormContactDetails('is_have_whatsapp'),
    isHaveWhatsAppTip: tFormContactDetails('is_have_whatsapp_tip'),
  }

  console.log('Translations:', {
    genericTranslations,
    addressTranslations,
    phoneTranslations,
  })

  try {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData || !userData.user) {
      throw new Error('User not authenticated')
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(
        'id, email, phone_number, is_have_whatsapp, main_address, user_name, avatar_url, communities (id, name)',
      )
      .eq('id', userData.user.id)
      .single<FixedProfile & { communities: { id: string; name: string }[] }>()

    if (profileError) {
      throw profileError
    }

    const user = userData?.user
    return (
      <ProfileCard
        user={{
          email: profileData?.email || user.email || '',
          createdAt: user.created_at || '',
          phone: profileData?.phone_number || '',
          fullName:
            profileData?.user_name || user.user_metadata?.full_name || '',
          address: {
            streetName: profileData?.main_address?.street_name || '',
            streetNumber: profileData?.main_address?.street_number || '',
            city: profileData?.main_address?.city || '',
            country: profileData?.main_address?.country || '',
            postalCode: profileData?.main_address?.postal_code || '',
          },
          avatarUrl:
            profileData?.avatar_url || user.user_metadata?.avatar_url || '',
          id: user.id,
        }}
        translations={{
          genericTranslations,
          toastTranslations,
          emailTranslations,
          addressTranslations,
          phoneTranslations,
        }}
      />
    )
  } catch (error) {
    console.error(error)
  }
}
