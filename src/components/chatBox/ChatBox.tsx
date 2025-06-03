"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthError } from "@supabase/supabase-js";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type Props = {
  chatWithUserId: string;
};

export default function ChatBox({ chatWithUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sessionError, setSessionError] = useState<AuthError | string | null>(
    null
  );

  const supabase = createClient();

  useEffect(() => {
    // Get session on mount
    const getSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        setSessionError(sessionError || "No user session");
        setUserId(null);
      } else {
        setUserId(sessionData.session.user.id);
      }
      setAuthChecked(true);
    };
    getSession();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;

    // Load messages between current user and selected user
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${chatWithUserId}),and(sender_id.eq.${chatWithUserId},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    loadMessages();

    // Realtime subscription
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          if (
            (msg.sender_id === userId && msg.receiver_id === chatWithUserId) ||
            (msg.sender_id === chatWithUserId && msg.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, chatWithUserId, supabase]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    await supabase.from("messages").insert([
      {
        sender_id: userId,
        receiver_id: chatWithUserId,
        content: newMessage.trim(),
      },
    ]);

    setNewMessage("");
  };

  if (!authChecked) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>Checking authentication...</p>
      </div>
    );
  }

  if (sessionError || !userId) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className='p-4 border'>
      <div className='overflow-y-auto space-y-2 h-[calc(100vh-160px)] p-2'>
        {messages.length === 0 ? (
          <div className='text-center text-muted-foreground text-sm mt-8'>
            עדיין אין הודעות. התחילו שיחה 🎉
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 text-sm rounded shadow-sm transition ${
                msg.sender_id === userId
                  ? "bg-blue-100 text-right rounded-tl-lg ml-auto"
                  : "bg-gray-200 text-left rounded-tr-lg mr-auto"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
      </div>

      <div className='flex space-x-2'>
        <input
          className='flex-1 border rounded p-2'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='כתוב הודעה...'
        />
        <button
          onClick={sendMessage}
          className='bg-blue-500 text-white rounded px-4'
        >
          שלח
        </button>
      </div>
    </div>
  );
}
