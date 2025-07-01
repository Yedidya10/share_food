'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUserCommunities(profileId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_roles')
    .select(
      `
      role,
      community:communities (
        id,
        name
      )
    `,
    )
    .eq('user_id', profileId)
    .order('role', { ascending: true }) // רק לסדר, אופציונלי

  if (error) {
    console.error('Failed to fetch user communities:', error)
    throw new Error('Could not fetch user communities')
  }

  // נהפוך למבנה נוח יותר לשימוש בריאקט:
  return data.map((item) => {
    const community = Array.isArray(item.community)
      ? item.community[0]
      : item.community
    return {
      id: community?.id,
      name: community?.name,
      role: item.role,
    }
  })
}
