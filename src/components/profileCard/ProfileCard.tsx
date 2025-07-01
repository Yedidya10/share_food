import AvatarEditor from './AvatarEditor'
import EditableName from './EditableName'
import EditablePhone from './EditablePhone'
import AddressDisplay from './AddressDisplay'
import CommunityBadges from './CommunityBadges'
import AchievementTags from './AchievementTags'

type UserProfile = {
  id: string
  email: string
  createdAt: string
  phone: string
  firstName: string
  lastName: string
  address: string
  avatarUrl: string
}

import { useTranslations } from 'next-intl'

export default function ProfilePage({ user }: { user: UserProfile }) {
  const t = useTranslations('profileCard')
  return (
    <main className="max-w-5xl mx-auto flex gap-8 px-6 py-12 rounded-lg shadow items-start">
      <section className="flex items-start gap-6">
        <AvatarEditor
          avatarUrl={user.avatarUrl}
          userId={user.id}
        />
      </section>
      <div className="flex-1 flex flex-col gap-16 px-6">
        <section className="rounded-xl shadow flex gap-10 items-start">
          <div className="flex flex-col gap-3 flex-1">
            <EditableName
              firstName={user.firstName}
              lastName={user.lastName}
              userId={user.id}
            />
            <p className="text-gray-500">{user.email}</p>
            <EditablePhone
              phone={user.phone}
              userId={user.id}
            />
            <AddressDisplay address={user.address} />
            <p className="text-xs text-gray-400">
              {t('joinedAt')}: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </section>

        <section className="rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">{t('communities')}</h3>
          <CommunityBadges userId={user.id} />
        </section>

        <section className="rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">{t('achievements')}</h3>
          <AchievementTags profileId={user.id} />
        </section>
      </div>
    </main>
  )
}
