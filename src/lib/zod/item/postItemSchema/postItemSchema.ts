import { itemSchemaBase } from '@/lib/zod/item/itemSchemaBase'
import { FormTranslationType } from '@/types/formTranslation'
import saveAddressSchema from '@/lib/zod/item/postItemSchema/saveAddressSchema'
import postItemImagesSchema from '@/lib/zod/item/postItemSchema/postItemImagesSchema'
import withAddressValidation from '../../withAddressValidation'
import withContactValidation from '../withContactValidation'

export default function postItemSchema(translation: FormTranslationType) {
  const baseSchema = itemSchemaBase(translation)
    .merge(postItemImagesSchema(translation))
    .merge(saveAddressSchema())

  // Add any additional refinements or transformations if needed
  const itemSchema = withContactValidation({
    schema: withAddressValidation({
      schema: baseSchema,
      translation,
    }),
    translation,
  })

  return itemSchema
}
