import { z } from 'zod'
import withAddressValidation from '@/lib/zod/withAddressValidation'
import { AddressFormTranslationFull } from '@/types/formTranslation'

export default function updateUserAddressSchema(
  translation: AddressFormTranslationFull,
) {
  return withAddressValidation({
    schema: z.object({}),
    translation,
  })
}
