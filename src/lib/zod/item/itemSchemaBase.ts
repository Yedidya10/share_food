import { z } from 'zod'
import { FormTranslationType } from '@/types/formTranslation'
import contactSchemaBase from '@/lib/zod/item/contactSchemaBase'
import addressSchemaBase from '@/lib/zod/addressSchemaBase'

function itemBaseSchema(translation: FormTranslationType) {
  return z.object({
    title: z
      .string()
      .min(5, { message: translation.titleMinLength })
      .max(50, { message: translation.titleMaxLength }),
    description: z
      .string({ required_error: translation.descriptionRequired })
      .min(10, { message: translation.descriptionMinLength })
      .max(300, { message: translation.descriptionMaxLength }),
  })
}

export function itemSchemaBase(translation: FormTranslationType) {
  return itemBaseSchema(translation)
    .merge(contactSchemaBase())
    .merge(addressSchemaBase(translation))
}
