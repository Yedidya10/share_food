import { z } from 'zod'
import { FormTranslationType } from '@/types/formTranslation'

export default function postItemImagesSchema(translation: FormTranslationType) {
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
