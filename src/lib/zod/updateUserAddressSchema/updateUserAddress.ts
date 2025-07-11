import withAddressValidation from '@/lib/zod/withAddressValidation'
import { AddressFormTranslationFull } from '@/types/formTranslation'
import addressSchemaBase from '@/lib/zod/addressSchemaBase'

export default function updateUserAddressSchema(
  translation: AddressFormTranslationFull,
) {
  return withAddressValidation({
    schema: addressSchemaBase(translation),
    translation,
  })
}
