"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

type Message = {
  id: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  created_at: string;
};

export default function ChatBox({
  conversationId,
  userId,
  initialMessages = [],
}: {
  conversationId: string;
  userId?: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`chat-room-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => [...prev, msg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];

    messages.forEach((msg) => {
      const createdAt = new Date(msg.created_at);
      const msgDateObj = dayjs(createdAt);

      let displayDate = msgDateObj.format("DD/MM/YYYY");
      if (dayjs().isSame(msgDateObj, "day")) {
        displayDate = "היום";
      } else if (dayjs().subtract(1, "day").isSame(msgDateObj, "day")) {
        displayDate = "אתמול";
      }

      const existingGroup = groups.find((g) => g.date === displayDate);
      if (existingGroup) {
        existingGroup.messages.push(msg);
      } else {
        groups.push({ date: displayDate, messages: [msg] });
      }
    });

    return groups;
  };

  if (!userId) {
    return (
      <div className='flex items-center justify-center'>
        <p className='text-gray-500'>בודק התחברות...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className='flex items-center justify-center'>
        <p className='text-gray-500'>עליך להתחבר כדי להשתמש בצ&apos;אט.</p>
      </div>
    );
  }

  async function onSubmit(data: { message: string }) {
    if (!data.message.trim()) return;

    const newMsg = {
      sender_id: userId!,
      conversation_id: conversationId,
      content: data.message.trim(),
    };

    const { error } = await supabase.from("messages").insert(newMsg);

    if (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      alert("שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.");
      return;
    }

    form.reset();
  }

  return (
    <div>
      {messages.length > 0 && (
        <div className='border p-4 h-[calc(100vh-200px)] overflow-y-auto'>
          {groupMessagesByDate().map((group, index) => (
            <div key={index} className='flex flex-col items-center pl-2'>
              <div className='text-center text-xs text-gray-400 my-2'>
                {group.date}
              </div>
              {group.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-2 py-1 text-sm rounded transition w-max max-w-[70%] mb-1 flex flex-col ${
                    msg.sender_id === userId
                      ? "bg-blue-100 text-blue-800 self-end dark:bg-blue-200"
                      : "bg-gray-100 text-gray-800 self-start dark:bg-gray-200"
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className='text-[10px] text-gray-500 text-end mt-1'>
                    {dayjs(msg.created_at).format("HH:mm")}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>
      )}
      <div className='flex space-x-2 pt-9'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full space-x-2'
          >
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input {...field} placeholder='כתוב הודעה...' />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type='submit' className='whitespace-nowrap'>
              שלח
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
