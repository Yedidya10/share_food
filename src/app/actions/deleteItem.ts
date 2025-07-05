'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteItem(itemId: string) {
  const supabase = await createClient()

  const { error: itemError } = await supabase
    .from('items')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', itemId)

  if (itemError) throw new Error('שגיאה במחיקת פריט: ' + itemError.message)

  return { success: true }
}
