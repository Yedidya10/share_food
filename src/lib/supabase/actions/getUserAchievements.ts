// app/actions/profile.ts או lib/actions/profile.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUserAchievements(profileId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profile_achievements')
    .select(
      `
      awarded_at,
      achievement:achievements (
        id,
        name,
        description,
        icon_url
      )
    `,
    )
    .eq('profile_id', profileId)
    .order('awarded_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch achievements', error)
    throw new Error('Could not fetch achievements')
  }

  // נהפוך למבנה נוח יותר לשימוש בריאקט:
  return data.map((item) => {
    const achievement = Array.isArray(item.achievement)
      ? item.achievement[0]
      : item.achievement
    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      iconUrl: achievement.icon_url,
      awardedAt: item.awarded_at,
    }
  })
}
