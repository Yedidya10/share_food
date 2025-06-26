import { getLocale } from 'next-intl/server'
import DeleteUserAccount from '@/components/deleteUserAccount/DeleteUserAccount'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  try {
    const locale = await getLocale()

    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData || !userData.user) {
      throw new Error('User not authenticated')
    }

    return (
      <div className="flex flex-col p-4 gap-4">
        <h1 className="text-xl font-bold">הגדרות חשבון</h1>
        <DeleteUserAccount
          locale={locale}
          userId={userData.user.id}
        />
      </div>
    )
  } catch (error) {
    console.error(error)
  }
}
