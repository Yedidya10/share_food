import { PhoneFieldTranslationFull } from '@/types/formTranslation'
import phoneNumberSchemaBase from '../phoneNumberSchemaBase'
import withPhoneValidation from '../withPhoneValidation'

export default function phoneUpdateFormSchema(
  translation: PhoneFieldTranslationFull,
) {
  return withPhoneValidation({
    schema: phoneNumberSchemaBase(),
    translation,
  })
}
