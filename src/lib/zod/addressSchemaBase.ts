import { z } from 'zod'
import { validateCity } from '@/lib/supabase/actions/locations'
import { AddressFormTranslationFull } from '@/types/formTranslation'

export default function addressSchemaBase(
  translation: AddressFormTranslationFull,
) {
  return z.object({
    streetName: z.string().nonempty({ message: translation.requiredError }),
    streetNumber: z
      .string()
      .min(1, { message: translation.minLengthError })
      .max(10, { message: translation.maxLengthError }),
    city: z
      .string()
      .nonempty({ message: translation.requiredError })
      .refine(
        async (city) => {
          if (!city) return false
          return await validateCity(city)
        },
        {
          message: `${translation.notFoundError} ${translation.city}`,
        },
      ),
    postalCode: z
      .string()
      .optional()
      .refine((value) => value?.trim() === '' || value?.length === 7, {
        message: translation.postalCodeError,
      }),
    country: z.string().nonempty({ message: translation.requiredError }),
  })
}
