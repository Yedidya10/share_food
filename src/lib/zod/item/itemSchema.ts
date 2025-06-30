// itemSchema.ts
import { itemSchemaBase } from './itemSchemaBase'
import { FormTranslationType } from '@/types/formTranslation'
import { RefinementCtx, z } from 'zod'
import { validateCity, validateStreet } from '@/lib/supabase/actions/locations'
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from 'react-phone-number-input'

type FormData = z.infer<ReturnType<typeof itemSchemaBase>>

export default function itemSchema(translation: FormTranslationType) {
  return itemSchemaBase(translation)
    .refine(
      (data: FormData) =>
        data.postalCode?.trim() === '' || data.postalCode?.length === 7,
      {
        path: ['postalCode'],
        message: translation.postalCodeError,
      },
    )
    .refine(
      (data: FormData) =>
        !data.contactByPhone ||
        (data.phoneNumber?.trim() !== '' &&
          isValidPhoneNumber(data.phoneNumber ?? '') &&
          isPossiblePhoneNumber(data.phoneNumber ?? '')),
      {
        message: translation.phoneNumberError,
        path: ['phoneNumber'],
      },
    )
    .refine(
      (data: FormData) =>
        !data.contactByEmail ||
        (data.email?.trim() !== '' &&
          z.string().email().safeParse(data.email).success),
      {
        message: translation.emailError,
        path: ['email'],
      },
    )
    .superRefine(async (data: FormData, ctx: RefinementCtx) => {
      const isValidCity = await validateCity(data.city)
      if (!isValidCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'עיר לא קיימת, נא לבחור מתוך הרשימה',
          path: ['city'],
        })
      }

      const isValidStreet = await validateStreet({
        street: data.streetName,
        city: data.city,
      })
      if (!isValidStreet) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'רחוב לא קיים, נא לבחור מתוך הרשימה',
          path: ['streetName'],
        })
      }
    })
}
