import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types/chat/chat'

export function useChatMessages(conversationId: string) {
  const supabase = createClient()

  return useQuery<Message[]>({
    queryKey: ['chat-messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data ?? []).map((msg) => ({
        ...msg,
        sender_id: msg.sender_id ?? '',
        created_at: msg.created_at ?? '', // Ensure created_at is always a string
        metadata:
          msg.metadata &&
          typeof msg.metadata === 'object' &&
          !Array.isArray(msg.metadata)
            ? msg.metadata
            : undefined,
      }))
    },
    staleTime: 1000 * 30, // 30 שניות
  })
}
