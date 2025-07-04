import { z } from 'zod'

export default function phoneNumberSchemaBase() {
  return z.object({
    phoneNumber: z.string().optional(),
    isHaveWhatsApp: z.boolean(),
  })
}
