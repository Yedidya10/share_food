'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Link } from '@/i18n/navigation'
import dayjs from 'dayjs'
import Image from 'next/image'
import getPartnerNames from '@/lib/supabase/actions/getPartnerNames'
import { Input } from '@/components/ui/input'
import useCurrentUser from '@/hooks/db/useCurrentUser'
import { Skeleton } from '@/components/ui/skeleton'

type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
  conversation_id: string
}

type Conversation = {
  id: string
  members: string[]
  last_message?: Message
}

export default function InboxClient() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser()
  const userId = currentUser?.id

  const [searchTerm, setSearchTerm] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [allConversations, setAllConversations] = useState<Conversation[]>([])
  const [conversationsLoaded, setConversationsLoaded] = useState(false)
  const [partnerNames, setPartnerNames] = useState<Record<string, string>>({})
  const [partnerAvatars, setPartnerAvatars] = useState<Record<string, string>>(
    {},
  )

  const conversationsRef = useRef<Conversation[]>([])
  const supabase = createClient()

  useEffect(() => {
    conversationsRef.current = conversations
  }, [conversations])

  // סינון
  useEffect(() => {
    const timeout = setTimeout(() => {
      const term = searchTerm.toLowerCase()
      if (!term) return setConversations(allConversations)

      const filtered = allConversations.filter((conv) => {
        const partnerId = conv.members.find((id) => id !== userId)
        const partnerName = partnerNames[partnerId ?? ''] || ''
        return (
          partnerName.toLowerCase().includes(term) ||
          (conv.last_message?.content || '').toLowerCase().includes(term)
        )
      })

      setConversations(filtered)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchTerm, partnerNames, userId, allConversations])

  // שליפת שיחות
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) return

      const { data: convs } = await supabase
        .from('conversations')
        .select('id, members')
        .contains('members', [userId])

      const convIds = convs?.map((c) => c.id) ?? []

      const { data: lastMessages } = await supabase
        .from('last_messages_per_conversation')
        .select('*')
        .in('conversation_id', convIds)

      const convsWithLastMsg = (convs ?? []).map((conv) => ({
        ...conv,
        last_message: lastMessages?.find(
          (msg) => msg.conversation_id === conv.id,
        ),
      }))

      convsWithLastMsg.sort(
        (a, b) =>
          new Date(b.last_message?.created_at ?? 0).getTime() -
          new Date(a.last_message?.created_at ?? 0).getTime(),
      )

      setAllConversations(convsWithLastMsg)
      setConversations(convsWithLastMsg)
      setConversationsLoaded(true)
    }

    fetchConversations()
  }, [supabase, userId])

  // טעינת פרטי משתמשים אחרים
  useEffect(() => {
    const partnerIds = [
      ...new Set(
        conversations.flatMap((conv) =>
          conv.members.filter((id) => id !== userId),
        ),
      ),
    ]
    if (partnerIds.length === 0) return
    ;(async () => {
      const partners = await getPartnerNames(partnerIds)
      if (partners) setPartnerNames(partners)

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .in('id', partnerIds)

      if (profilesData) {
        const map: Record<string, string> = {}
        profilesData.forEach((u) => (map[u.id] = u.avatar_url || ''))
        setPartnerAvatars(map)
      }
    })()
  }, [conversations, supabase, userId])

  // רילטיים
  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message
          const update = (list: Conversation[]) =>
            list.map((conv) =>
              conv.id === newMessage.conversation_id &&
              (!conv.last_message ||
                new Date(newMessage.created_at) >
                  new Date(conv.last_message.created_at))
                ? { ...conv, last_message: newMessage }
                : conv,
            )
          setAllConversations(update)
          setConversations(update)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0]
  }

  const formatMessageDate = (created_at?: string) => {
    if (!created_at) return ''
    if (dayjs().isSame(created_at, 'day')) {
      return new Date(created_at).toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    if (dayjs().subtract(1, 'day').isSame(created_at, 'day')) return 'אתמול'
    return dayjs(created_at).format('DD/MM/YYYY')
  }

  const isInitialLoading = userLoading || !conversationsLoaded

  const allPartnerNamesLoaded = conversations.every((conv) => {
    const partnerId = conv.members.find((id) => id !== userId) ?? ''
    return partnerNames[partnerId]
  })

  return (
    <div className="w-full md:w-[25vw] md:min-w-[270px] border-r bg-background">
      <div className="mx-auto">
        <div className="flex items-center justify-between p-3 gap-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">שיחות</h2>
          <Input
            type="text"
            placeholder="חפש שיחה..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isInitialLoading || !allPartnerNamesLoaded ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-3 items-center"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-24">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg font-medium">אין שיחות עדיין</p>
            <p className="text-sm">ברגע שתשלח או תקבל הודעה – היא תופיע כאן.</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const partnerId = conv.members.find((id) => id !== userId) ?? ''
            const partnerName = partnerNames[partnerId]
            const avatar = partnerAvatars[partnerId]

            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="flex items-center p-3 gap-3 hover:bg-muted transition border-b border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="flex-shrink-0">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={partnerName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg dark:bg-blue-700">
                      {getInitials(partnerName)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-semibold text-gray-900 truncate dark:text-gray-100">
                      {partnerName}
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap dark:text-gray-400">
                      {formatMessageDate(conv.last_message?.created_at)}
                    </div>
                  </div>
                  <div
                    className="text-sm text-gray-600 truncate dark:text-gray-300"
                    title={conv.last_message?.content ?? ''}
                  >
                    {conv.last_message?.content ?? 'אין הודעות'}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
