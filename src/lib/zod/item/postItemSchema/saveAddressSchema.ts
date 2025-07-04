import { z } from 'zod'

export default function saveAddressSchema() {
  return z.object({
    saveAddress: z.boolean().default(false).optional(),
  })
}
