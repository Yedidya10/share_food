// postItemSchema.ts
import { z } from 'zod'
import { itemSchemaBase } from '@/lib/zod/item/itemSchemaBase'
import { FormTranslationType } from '@/types/formTranslation'

function postItemImagesSchema(translation: FormTranslationType) {
  return z.object({
    images: z
      .array(
        z.object({
          id: z.string().optional(),
          url: z.string().optional(),
          file: z.instanceof(File).optional(),
          hash: z.string().optional(),
        }),
      )
      .min(
        1,
        translation.uploadImagesError || 'Please upload at least one image.',
      )
      .max(
        3,
        translation.uploadImagesError || 'You can upload up to 3 images.',
      ),
  })
}

function saveAddressSchema() {
  return z.object({
    saveAddress: z.boolean().default(false).optional(),
  })
}

export default function postItemSchema(translation: FormTranslationType) {
  const base = itemSchemaBase(translation)
    .merge(postItemImagesSchema(translation))
    .merge(saveAddressSchema())

  // עכשיו על base אתה מוסיף refine / superRefine כמו קודם אם צריך.
  return base
}
