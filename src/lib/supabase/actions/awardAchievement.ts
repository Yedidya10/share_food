'use server'

import { createClient } from '@/lib/supabase/server'

export async function awardAchievement({
  profileId,
  achievementId,
}: {
  profileId: string
  achievementId: string
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profile_achievements')
    .insert([{ profile_id: profileId, achievement_id: achievementId }])

  if (error) {
    console.error('Failed to award achievement:', error)
    throw new Error('Failed to award achievement')
  }
}
