import contactSchemaBase from '@/lib/zod/item/contactSchemaBase'
import { ContactFormTranslationBase } from '@/types/formTranslation'
import { z } from 'zod'
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from 'react-phone-number-input'

type FormData = z.infer<ReturnType<typeof contactSchemaBase>>

export default function withContactValidation<T extends z.ZodTypeAny>({
  schema,
  translation,
}: {
  schema: T
  translation: ContactFormTranslationBase
}) {
  return schema
    .refine(
      (data: FormData) =>
        !data.contactByPhone ||
        (data.phoneNumber?.trim() !== '' &&
          isValidPhoneNumber(data.phoneNumber ?? '') &&
          isPossiblePhoneNumber(data.phoneNumber ?? '')),
      { message: translation.phoneNumberError, path: ['phoneNumber'] },
    )
    .refine(
      (data: FormData) =>
        !data.contactByEmail ||
        (data.email?.trim() !== '' &&
          z.string().email().safeParse(data.email).success),
      { message: translation.emailError, path: ['email'] },
    )
}
