import { z } from 'zod'

export default function contactSchemaBase() {
  return z.object({
    contactViaSite: z.boolean(),
    contactByPhone: z.boolean(),
    phoneNumber: z.string().optional(),
    isHaveWhatsApp: z.boolean(),
    savePhone: z.boolean().default(false).optional(),
    contactByEmail: z.boolean(),
    email: z.string().optional(),
  })
}
