import type { AddressFormTranslationFull } from '@/types/formTranslation'
import type AddressFields from '@/types/item/address'

const profileAddressUpdateDefaultValues = ({
  initialValues,
  translation,
}: {
  translation: AddressFormTranslationFull
  initialValues: AddressFields
}) => {
  console.log('Default values for address update form:', translation.israel)
  return {
    streetName: initialValues?.streetName || '',
    streetNumber: initialValues?.streetNumber || '',
    city: initialValues?.city || '',
    country:
      initialValues?.country !== undefined
        ? ((translation as Record<string, string>)[initialValues.country] ??
          initialValues.country)
        : translation.israel, // Default
    postalCode: initialValues?.postalCode || '',
  }
}

export default profileAddressUpdateDefaultValues
