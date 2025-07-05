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
  const shape = schema instanceof z.ZodObject ? schema.shape : {}
  const hasContactByPhone = shape && 'contactByPhone' in shape

  return schema.refine(
    (data: FormData) => {
      const phone = data.phoneNumber ?? ''
      const phoneRequired = hasContactByPhone ? data.contactByPhone : true

      return (
        !phoneRequired ||
        (phone.trim() !== '' &&
          isValidPhoneNumber(phone) &&
          isPossiblePhoneNumber(phone))
      )
    },
    { message: translation.phoneNumberError, path: ['phoneNumber'] },
  )
}
