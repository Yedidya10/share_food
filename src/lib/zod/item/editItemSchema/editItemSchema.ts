import { z } from 'zod'
import { itemSchemaBase } from '../itemSchemaBase'
import { FormTranslationType } from '@/types/formTranslation'
import editItemImagesSchema from './editItemImagesSchema'
import withContactValidation from '../withContactValidation'
import withAddressValidation from '../../withAddressValidation'

export default function editItemSchema(translation: FormTranslationType) {
  const baseSchema = itemSchemaBase(translation).merge(
    editItemImagesSchema(translation),
  )

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

export type EditItemFormSchema = z.infer<ReturnType<typeof editItemSchema>>
