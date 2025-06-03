// components/InboxClient.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Separator } from "../ui/separator";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type ConversationSummary = {
  partner_id: string;
  last_message: Message;
};

export default function InboxClient() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError.message);
        return;
      }

      const sessionUserId = sessionData.session?.user.id;
      if (!sessionUserId) return;

      setUserId(sessionUserId);
      setUserFullName(
        sessionData.session?.user.user_metadata.full_name || null
      );
    };

    getSession();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error || !data) {
        console.error("Error fetching messages:", error?.message);
        return;
      }

      const map = new Map<string, Message>();

      for (const msg of data) {
        const partnerId =
          msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        const existing = map.get(partnerId);

        if (
          !existing ||
          new Date(msg.created_at) > new Date(existing.created_at)
        ) {
          map.set(partnerId, msg);
        }
      }

      const sorted = Array.from(map.entries())
        .map(([partner_id, last_message]) => ({ partner_id, last_message }))
        .sort(
          (a, b) =>
            new Date(b.last_message.created_at).getTime() -
            new Date(a.last_message.created_at).getTime()
        );

      setConversations(sorted);
    };

    fetchConversations();
  }, [userId, supabase]);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-2'>השיחות שלי</h2>
      <Separator className='mb-4' />

      {conversations.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center text-muted-foreground py-24'>
          <div className='text-5xl mb-4'>💬</div>
          <p className='text-lg font-medium'>אין שיחות עדיין</p>
          <p className='text-sm'>ברגע שתשלח או תקבל הודעה – היא תופיע כאן.</p>
        </div>
      ) : (
        conversations.map((c) => (
          <div key={c.last_message.id}>
            <Link
              href={`/chat/${c.partner_id}`}
              className='block p-3 hover:bg-muted rounded-md transition'
            >
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>{userFullName}</span>
              </div>
              <div className='text-base truncate'>{c.last_message.content}</div>
              <div className='text-xs text-gray-400'>
                {new Date(c.last_message.created_at).toLocaleString()}
              </div>
            </Link>
            <Separator />
          </div>
        ))
      )}
    </div>
  );
}
