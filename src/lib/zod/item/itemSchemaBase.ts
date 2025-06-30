// itemSchemaBase.ts
import { z } from 'zod'
import { FormTranslationType } from '@/types/formTranslation'

//
// סכמות בסיס שכל אחת מחזירה z.object פשוט
//

export function itemBaseSchema(translation: FormTranslationType) {
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

export function locationSchemaBase() {
  return z.object({
    streetName: z.string().min(2).max(50),
    streetNumber: z.string().min(1).max(10),
    city: z.string().min(2).max(10),
    postalCode: z.string().optional(),
    country: z.string().min(2).max(20),
  })
}

export function contactSchemaBase() {
  return z.object({
    contactViaSite: z.boolean(),
    contactByPhone: z.boolean(),
    phoneNumber: z.string().optional(),
    isHaveWhatsApp: z.boolean(),
    contactByEmail: z.boolean(),
    email: z.string().optional(),
  })
}

//
// סכמה בסיסית שמאחדת את שלושתן – מחזירה עדיין z.object
//

export function itemSchemaBase(translation: FormTranslationType) {
  return itemBaseSchema(translation)
    .merge(locationSchemaBase())
    .merge(contactSchemaBase())
}
