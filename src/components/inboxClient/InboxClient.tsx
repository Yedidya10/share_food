"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import dayjs from "dayjs";
import Image from "next/image";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  conversation_id: string;
};

type Conversation = {
  id: string;
  members: string[];
  last_message?: Message;
};

export default function InboxClient({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [partnerNames, setPartnerNames] = useState<Record<string, string>>({});
  const [partnerAvatars, setPartnerAvatars] = useState<Record<string, string>>(
    {}
  );
  const conversationsRef = useRef<Conversation[]>([]);
  const supabase = createClient();

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    const fetchConversationsWithLastMessages = async () => {
      const { data: convs, error: convError } = await supabase
        .from("conversations")
        .select("id, members")
        .contains("members", [userId]);

      if (convError || !convs) {
        console.error("Error fetching conversations:", convError);
        return;
      }

      const convIds = convs.map((c) => c.id);

      const { data: lastMessages, error: lmError } = await supabase
        .from("last_messages_per_conversation")
        .select("*")
        .in("conversation_id", convIds);

      if (lmError) {
        console.error("Error fetching last messages:", lmError);
        return;
      }

      const convsWithLastMsg = convs.map((conv) => {
        const last_message = lastMessages?.find(
          (msg) => msg.conversation_id === conv.id
        );
        return { ...conv, last_message };
      });

      convsWithLastMsg.sort((a, b) => {
        if (!a.last_message) return 1;
        if (!b.last_message) return -1;
        return (
          new Date(b.last_message.created_at).getTime() -
          new Date(a.last_message.created_at).getTime()
        );
      });

      setConversations(convsWithLastMsg);
    };

    fetchConversationsWithLastMessages();
  }, [userId, supabase]);

  useEffect(() => {
    const loadPartnerNames = async () => {
      const partnerIds = conversations.flatMap((conv) =>
        conv.members.filter((id) => id !== userId)
      );

      if (partnerIds.length === 0) return;

      const { data: profilesData } = await supabase
        .from("profilesData")
        .select("id, full_name")
        .in("id", partnerIds);

      if (!profilesData) return;

      const map: Record<string, string> = {};
      profilesData.forEach((u) => {
        map[u.id] = u.full_name;
      });
      setPartnerNames(map);
    };

    const loadPartnerAvatars = async () => {
      const partnerIds = conversations.flatMap((conv) =>
        conv.members.filter((id) => id !== userId)
      );

      if (partnerIds.length === 0) return;
      const { data: profilesData } = await supabase
        .from("profilesData")
        .select("id, avatar_url")
        .in("id", partnerIds);
      if (!profilesData) return;

      const map: Record<string, string> = {};
      profilesData.forEach((u) => {
        map[u.id] = u.avatar_url || "";
      });
      setPartnerAvatars(map);
    };

    loadPartnerAvatars();
    loadPartnerNames();
  }, [conversations, userId, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;

          const isInConversation = conversationsRef.current.some(
            (conv) => conv.id === newMessage.conversation_id
          );
          if (!isInConversation) return;

          setConversations((prevConvs) => {
            return prevConvs.map((conv) => {
              if (conv.id === newMessage.conversation_id) {
                if (
                  !conv.last_message ||
                  new Date(newMessage.created_at) >
                    new Date(conv.last_message.created_at)
                ) {
                  return {
                    ...conv,
                    last_message: newMessage,
                  };
                }
              }
              return conv;
            });
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  function getInitials(name: string) {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0];
    return names[0][0] + names[1][0];
  }

  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-xl font-semibold p-2'>השיחות שלי</h2>

      {conversations.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center text-muted-foreground py-24'>
          <div className='text-5xl mb-4'>💬</div>
          <p className='text-lg font-medium'>אין שיחות עדיין</p>
          <p className='text-sm'>ברגע שתשלח או תקבל הודעה – היא תופיע כאן.</p>
        </div>
      ) : (
        conversations.map((conv) => {
          const partnerId = conv.members.find((id) => id !== userId) ?? "";
          const partnerName = partnerNames[partnerId] ?? "משתמש";

          return (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className='flex items-center p-3 hover:bg-muted transition border-b border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'
            >
              <div className='flex-shrink-0'>
                {partnerAvatars[partnerId] ? (
                  <Image
                    src={partnerAvatars[partnerId]}
                    alt={partnerName}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg ml-4 dark:bg-blue-700'>
                    {getInitials(partnerName)}
                  </div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-center mb-1'>
                  <p className='text-sm font-semibold text-gray-900 truncate dark:text-gray-100'>
                    {partnerName}
                  </p>
                  <p className='text-xs text-gray-400 whitespace-nowrap dark:text-gray-400'>
                    {conv.last_message &&
                    dayjs().isSame(conv.last_message.created_at, "day")
                      ? new Date(
                          conv.last_message.created_at
                        ).toLocaleTimeString("he-IL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : conv.last_message &&
                          dayjs()
                            .subtract(1, "day")
                            .isSame(conv.last_message.created_at, "day")
                        ? "אתמול"
                        : conv.last_message
                          ? dayjs(conv.last_message.created_at).format(
                              "DD/MM/YYYY"
                            )
                          : ""}
                  </p>
                </div>
                <p
                  className='text-sm text-gray-600 truncate dark:text-gray-300'
                  title={conv.last_message?.content ?? ""}
                >
                  {conv.last_message?.content ?? "אין הודעות"}
                </p>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
