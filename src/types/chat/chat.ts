export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  type?: 'user' | 'system'
  metadata?: {
    item_id?: string
    [key: string]: unknown
  }
}
