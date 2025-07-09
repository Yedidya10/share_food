// components/chat/ChatBox.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { useChatMessages } from '@/hooks/db/useChatMessages'
import { useSendMessage } from '@/hooks/db/useSendMessage'
import { createClient } from '@/lib/supabase/client'

import ChatHeader from '@/components/chat/chatHeader/ChatHeader'
import MessageBubble from '@/components/chat/messageBubble/MessageBubble'
import ItemPreviewMessage from '@/components/chat/itemPreviewMessage/ItemPreviewMessage'
import { Database } from '@/types/supabase-fixed'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Message } from '@/types/chat/chat'

export default function ChatBox({
  otherUser,
  conversationId,
  userId,
  item,
}: {
  otherUser: { id: string; user_name: string; avatar_url: string }
  conversationId: string
  userId?: string
  item?: Database['public']['Views']['active_items']['Row'] | null
}) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const form = useForm({ mode: 'onChange', defaultValues: { message: '' } })

  const { data: messages = [] } = useChatMessages(conversationId)
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()

  const [itemsMap, setItemsMap] = useState<
    Record<string, Database['public']['Views']['active_items']['Row']>
  >({})
  const [sendOnEnter, setSendOnEnter] = useState(true)

  // האם כבר קיימת הודעת פריט ב־DB?
  const previewExistsInDb = Boolean(
    item &&
      messages.find(
        (m) =>
          m.type === 'system' &&
          m.content === '__ITEM_PREVIEW__' &&
          m.metadata?.item_id === item.id,
      ),
  )

  // טעינת פריטים עבור הודעות מערכת
  useEffect(() => {
    const ids = messages
      .filter((m) => m.type === 'system' && m.content === '__ITEM_PREVIEW__')
      .map((m) => m.metadata?.item_id)
      .filter(Boolean) as string[]
    if (!ids.length) return
    ;(async () => {
      const { data } = await supabase.from('items').select('*').in('id', ids)
      if (data) {
        setItemsMap((prev) => ({
          ...prev,
          ...Object.fromEntries(data.map((i) => [i.id, i])),
        }))
      }
    })()
  }, [messages, supabase])

  // גלילה אוטומטית
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // מנוי ריל־טיים
  useEffect(() => {
    // פותחים את הערוץ
    const channel = supabase
      .channel(`chat-room-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['chat-messages', conversationId],
          })
        },
      )
      .subscribe()

    // ה־cleanup — פונקציה סינכרונית שמפעילה את supabase.removeChannel
    return () => {
      // בלי async, בלי לחכות לתוצאה
      void supabase.removeChannel(channel)
    }
  }, [conversationId, supabase, queryClient])

  // קיבוץ לפי תאריך
  const groupByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    msgs.forEach((m) => {
      const d = dayjs(m.created_at)
      const label = dayjs().isSame(d, 'day')
        ? 'היום'
        : dayjs().subtract(1, 'day').isSame(d, 'day')
          ? 'אתמול'
          : d.format('DD/MM/YYYY')
      const g = groups.find((x) => x.date === label)
      if (g) g.messages.push(m)
      else groups.push({ date: label, messages: [m] })
    })
    return groups
  }

  // שליחה
  const onSubmit = form.handleSubmit((data) => {
    if (!data.message.trim() || isSending) return
    sendMessage({
      conversationId,
      userId: userId!,
      content: data.message,
      shouldSendPreview: !previewExistsInDb,
      item: item ?? undefined,
    })
    form.reset()
  })

  if (!userId) {
    return (
      <div className="p-4 text-center">עליך להתחבר כדי להשתמש בצ&apos;אט.</div>
    )
  }

  return (
    <div className="h-[calc(100svh-60px)] flex flex-col">
      {/* HEADER */}
      <div className="border-b sticky top-0 z-20 bg-background">
        <ChatHeader
          fullName={otherUser.user_name}
          avatarUrl={otherUser.avatar_url}
        />
      </div>

      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {/* 1️⃣ קודם כל – מיפוי ושיוך קבוצות ההודעות מה-DB */}
        {groupByDate(messages).map((group) => (
          <div
            key={group.date}
            className="flex flex-col items-center"
          >
            <div className="text-center text-xs text-muted-foreground my-2">
              {group.date}
            </div>
            {group.messages.map((msg) => {
              if (msg.type === 'system' && msg.content === '__ITEM_PREVIEW__') {
                const id = msg.metadata?.item_id
                if (!id) return null
                const itm = item?.id === id ? item : itemsMap[id]
                return itm ? (
                  <ItemPreviewMessage
                    key={msg.id}
                    item={itm}
                  />
                ) : null
              }
              return (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isOwn={msg.sender_id === userId}
                />
              )
            })}
          </div>
        ))}

        {/* 2️⃣ לאחר כל ההודעות מה-DB – ה-preview הזמני בתחתית (אם עוד לא שמור ב-DB) */}
        {!previewExistsInDb && item && (
          <div className="flex flex-col items-center">
            <ItemPreviewMessage
              key="temp-preview"
              item={item}
            />
          </div>
        )}

        {/* 3️⃣ אלמנט גולל */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="border-t p-3 sticky bottom-0 z-20 bg-background">
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id="sendOnEnter"
            checked={sendOnEnter}
            onCheckedChange={(c) => setSendOnEnter(!!c)}
          />
          <Label
            htmlFor="sendOnEnter"
            className="text-sm text-muted-foreground"
          >
            שלח בלחיצת Enter
          </Label>
        </div>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex gap-2 items-end"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      rows={1}
                      maxLength={1000}
                      autoFocus
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && sendOnEnter) {
                          e.preventDefault()
                          onSubmit()
                        }
                      }}
                      className="resize-none max-h-[120px] rounded-xl bg-muted text-sm"
                      placeholder="כתוב הודעה..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="rounded-xl"
              disabled={isSending}
            >
              שלח
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
