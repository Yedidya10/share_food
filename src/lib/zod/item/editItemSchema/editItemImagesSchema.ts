import { z } from 'zod'
import { FormTranslationType } from '@/types/formTranslation'

export default function editItemImagesSchema(translation: FormTranslationType) {
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
      .max(3, translation.uploadImagesError || 'You can upload up to 3 images.')
      .superRefine((images, ctx) => {
        // Check if at least we have one image file or URL
        const hasFileOrUrl = images.some((img) => img.file || img.url)
        if (!hasFileOrUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              translation.uploadImagesError ||
              'Please upload at least one image.',
          })
        }
      }),
  })
}
