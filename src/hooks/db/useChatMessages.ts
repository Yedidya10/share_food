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
      return data ?? []
    },
    staleTime: 1000 * 30, // 30 שניות
  })
}
