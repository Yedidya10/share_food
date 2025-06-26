// EditItemFormWrapper.tsx
import EditItemForm from '@/components/forms/editItemForm/EditItemForm'
import { getItemById } from '@/lib/supabase/actions/getItemById'
import { getTranslations } from 'next-intl/server'
import { EditItemFormValues } from '@/types/item/item'

export async function EditItemFormWrapper({ itemId }: { itemId: string }) {
  // Fetch
  const item = await getItemById(itemId)
  if (!item) {
    throw new Error('Item not found')
  }

  // Translations
  const tPostItemForm = await getTranslations('form.postItem')
  const tEditItemForm = await getTranslations('form.editItem')
  const tGenericForm = await getTranslations('form.generic')
  const tCountries = await getTranslations('countries')

  const formInitialValues: EditItemFormValues = {
    title: item.title,
    description: item.description,
    images: item.images,
    streetName: item.street_name,
    streetNumber: item.street_number,
    city: item.city,
    postalCode: item.postal_code,
    country: item.country,
    phoneNumber: item.phone_number,
    email: item.email,
    isHaveWhatsApp: item.is_have_whatsapp,
    contactViaSite: true,
    contactByPhone: !!item.phone_number,
    contactByEmail: !!item.email,
  }

  return (
    <EditItemForm
      itemId={itemId}
      itemStatus={item.status}
      initialValues={formInitialValues}
      translation={{
        formTitle: tEditItemForm('form_title'),
        formDescription: tEditItemForm('form_description'),
        title: tPostItemForm('title'),
        titlePlaceholder: tPostItemForm('title_placeholder'),
        titleRequired: tPostItemForm('title_required'),
        titleMaxLength: tPostItemForm('title_max_length'),
        titleMinLength: tPostItemForm('title_min_length'),
        description: tPostItemForm('description'),
        descriptionPlaceholder: tPostItemForm('description_placeholder'),
        descriptionRequired: tPostItemForm('description_required'),
        descriptionMaxLength: tPostItemForm('description_max_length'),
        descriptionMinLength: tPostItemForm('description_min_length'),
        uploadImages: tPostItemForm('upload_images'),
        uploadImagesError: tPostItemForm('upload_images_error'),
        addressDetails: tPostItemForm('address_details'),
        streetName: tPostItemForm('street_name'),
        streetNamePlaceholder: tPostItemForm('street_name_placeholder'),
        streetNameError: tPostItemForm('street_name_error'),
        streetNumber: tPostItemForm('street_number'),
        streetNumberPlaceholder: tPostItemForm('street_number_placeholder'),
        streetNumberError: tPostItemForm('street_number_error'),
        city: tPostItemForm('city'),
        cityPlaceholder: tPostItemForm('city_placeholder'),
        cityError: tPostItemForm('city_error'),
        postalCode: tPostItemForm('postal_code'),
        postalCodePlaceholder: tPostItemForm('postal_code_placeholder'),
        postalCodeError: tPostItemForm('postal_code_error'),
        country: tPostItemForm('country'),
        contactDetails: tPostItemForm('contact_details'),
        contactViaSite: tPostItemForm('contact_via_site'),
        phoneNumber: tPostItemForm('phone_number'),
        phoneNumberPlaceholder: tPostItemForm('phone_number_placeholder'),
        phoneNumberError: tPostItemForm('phone_number_error'),
        isHaveWhatsApp: tPostItemForm('is_have_whatsapp'),
        isHaveWhatsAppTip: tPostItemForm('is_have_whatsapp_tip'),
        email: tPostItemForm('email'),
        emailPlaceholder: tPostItemForm('email_placeholder'),
        emailError: tPostItemForm('email_error'),
        submitButton: tEditItemForm('submit_button'),
        submitButtonProcessing: tEditItemForm('submit_button_processing'),
        cancel: tGenericForm('cancel'),
        required: tGenericForm('required'),
        reset: tGenericForm('reset'),
        israel: tCountries('israel'),
      }}
    />
  )
}
