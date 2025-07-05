import type { AddressFormTranslationFull } from '@/types/formTranslation'
import type AddressFields from '@/types/item/address'

const profileAddressUpdateDefaultValues = ({
  initialValues,
  translation,
}: {
  translation: AddressFormTranslationFull
  initialValues?: AddressFields
}) => {
  return {
    streetName: initialValues?.streetName || '',
    streetNumber: initialValues?.streetNumber || '',
    city: initialValues?.city || '',
    country:
      initialValues?.country !== undefined
        ? ((translation as Record<string, string>)[initialValues.country] ??
          initialValues.country)
        : '',
    postalCode: initialValues?.postalCode || '',
  }
}

export default profileAddressUpdateDefaultValues
