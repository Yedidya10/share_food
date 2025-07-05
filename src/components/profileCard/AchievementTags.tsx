import { getUserAchievements } from '@/app/actions/getUserAchievements'
import Image from 'next/image'
import { use } from 'react'

export default function AchievementTags({ profileId }: { profileId: string }) {
  const userAchievements = use(getUserAchievements(profileId))

  return (
    <div className="flex flex-wrap gap-2">
      {userAchievements.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
        >
          <Image
            src={tag.iconUrl}
            alt={tag.name}
            width={16}
            height={16}
            className="w-4 h-4"
          />
          {tag.name}
        </div>
      ))}
    </div>
  )
}
