import ProfileCard from '@/components/profileCard/ProfileCard'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  try {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData || !userData.user) {
      throw new Error('User not authenticated')
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(
        'id, phone_number, is_have_whatsapp, main_address, first_name, last_name, avatar_url, communities (id, name)',
      )
      .eq('id', userData.user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    const user = userData?.user
    return (
      <ProfileCard
        user={{
          email: user.email || '',
          createdAt: user.created_at || '',
          phone: profileData?.phone_number || '',
          firstName:
            profileData?.first_name ||
            user.user_metadata?.full_name.split(' ')[0] ||
            '',
          lastName:
            profileData?.last_name ||
            user.user_metadata?.full_name.split(' ')[1] ||
            '',
          address: profileData?.main_address || '',
          avatarUrl:
            profileData?.avatar_url || user.user_metadata?.avatar_url || '',
          id: user.id,
        }}
      />
    )
  } catch (error) {
    console.error(error)
  }
}
