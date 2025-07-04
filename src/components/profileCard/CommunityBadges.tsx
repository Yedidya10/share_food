import { use } from 'react'
import JoinCommunityMenu from './JoinCommunityMenu'
import { createClient } from '@/lib/supabase/server'
import { getUserCommunities } from '@/lib/supabase/actions/getUserCommunities'
import { toast } from 'sonner'

export default function CommunityBadges({ userId }: { userId: string }) {
  const userCommunities = use(getUserCommunities(userId))

  const handleRemove = async ({
    communityId,
    communityName,
  }: {
    communityId: string
    communityName: string
  }) => {
    if (!communityId || !userId) {
      console.error('Missing communityId or userId')
      return
    }
    const supabase = await createClient()

    const { error } = await supabase
      .from('community_roles')
      .delete()
      .eq('user_id', userId)
      .eq('community_id', communityId)

    if (error) {
      console.error('Failed to remove community:', error)
      throw new Error('Could not remove community')
    }

    toast.success(`הקהילה ${communityName} הוסרה בהצלחה`)
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {userCommunities.map((comm) => (
        <div
          key={comm.id}
          className="relative group"
        >
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            {comm.name}
          </span>
          <button
            onClick={() =>
              handleRemove({
                communityId: comm.id,
                communityName: comm.name,
              })
            }
            className="absolute -top-1 -right-1 hidden group-hover:block text-red-500 text-xs bg-white rounded-full"
          >
            ×
          </button>
        </div>
      ))}
      <JoinCommunityMenu userId={userId} />
    </div>
  )
}
