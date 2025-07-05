import { z, RefinementCtx } from 'zod'
import { validateStreet } from '@/app/actions/locations'
import { AddressFormTranslationFull } from '@/types/formTranslation'

export default function withAddressValidation<T extends z.ZodTypeAny>({
  schema,
  translation,
}: {
  schema: T
  translation: AddressFormTranslationFull
}) {
  return schema.superRefine(async (data, ctx: RefinementCtx) => {
    if (data.city && data.streetName) {
      const isValidStreet = await validateStreet({
        street: data.streetName,
        city: data.city,
      })
      if (!isValidStreet) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${data.streetName} ${translation.notFoundError}`,
          path: ['streetName'],
        })
      }
    }
  })
}
