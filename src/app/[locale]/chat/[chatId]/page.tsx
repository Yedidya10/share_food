import ChatBox from '@/components/chat/chatBox/ChatBox'
import { createClient } from '@/lib/supabase/server'
import { redirect } from '@/i18n/navigation'
import { getItemById } from '@/lib/supabase/actions/getItemById'

export default async function ChatThread({
  params,
  searchParams,
}: {
  searchParams?: Promise<{ itemId?: string }>
  params: Promise<{
    chatId: string
    locale: string
  }>
}) {
  try {
    const { chatId: conversationId, locale } = await params
    const { itemId } = (await searchParams) ?? {}

    if (!conversationId || conversationId === 'null') {
      console.error('Invalid conversation ID')
      redirect({ href: '/chat', locale })
    }

    // Get item details if itemId is provided
    const item = itemId ? await getItemById(itemId) : null

    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      throw new Error('Failed to fetch user data')
    }

    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('id, members')
      .eq('id', conversationId)
      .single()

    if (conversationError || !conversation) {
      throw new Error('Conversation not found')
    }

    const otherUserId = conversation.members.find(
      (memberId: string) => memberId !== userData.user.id,
    )

    if (!otherUserId) throw new Error('Other user not found')

    const { data: otherUser, error: otherUserError } = await supabase
      .from('profiles')
      .select('id, user_name, avatar_url')
      .eq('id', otherUserId)
      .single()

    if (otherUserError) throw new Error('Failed to fetch other user')

    return (
      <div className="flex flex-1 flex flex-col h-[calc(100vh-60px)] overflow-hidden">
        <ChatBox
          item={item}
          otherUser={otherUser}
          conversationId={conversationId}
          userId={userData.user.id}
        />
      </div>
    )
  } catch (error) {
    console.error(error)
  }
}
