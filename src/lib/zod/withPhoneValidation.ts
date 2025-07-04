import contactSchemaBase from '@/lib/zod/item/contactSchemaBase'
import { PhoneFieldTranslationFull } from '@/types/formTranslation'
import { z } from 'zod'
import {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from 'react-phone-number-input'

type FormData = z.infer<ReturnType<typeof contactSchemaBase>>

export default function withPhoneValidation<T extends z.ZodTypeAny>({
  schema,
  translation,
}: {
  schema: T
  translation: PhoneFieldTranslationFull
}) {
  return schema.refine(
    (data: FormData) =>
      !data.contactByPhone ||
      (data.phoneNumber?.trim() !== '' &&
        isValidPhoneNumber(data.phoneNumber ?? '') &&
        isPossiblePhoneNumber(data.phoneNumber ?? '')),
    { message: translation.phoneNumberError, path: ['phoneNumber'] },
  )
}
