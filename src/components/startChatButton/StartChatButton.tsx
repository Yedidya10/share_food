"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  targetUserId: string;
};

export default function StartChatButton({ targetUserId }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClient();

  // Fetch current user id on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      setCurrentUserId(data.user?.id || null);
    });
  }, [supabase]);

  const handleClick = async () => {
    if (!currentUserId) return;

    setLoading(true);

    const members = [currentUserId, targetUserId].sort();

    try {
      // 1. Check if a conversation already exists with these members
      const { data: conversations, error: selectError } = await supabase
        .from("conversations")
        .select("id, members")
        .contains("members", members);

      if (selectError) throw selectError;

      // 2. Check if the conversation already exists
      const existingConversation = conversations?.find((conv) => {
        if (conv.members.length !== members.length) return false;
        for (let i = 0; i < members.length; i++) {
          if (conv.members[i] !== members[i]) return false;
        }
        return true;
      });

      if (existingConversation) {
        setConversationId(existingConversation.id);
      } else {
        // 3. If no conversation exists, create a new one
        const { data: newConversation, error: insertError } = await supabase
          .from("conversations")
          .insert({ members })
          .select()
          .single();

        if (insertError) throw insertError;

        setConversationId(newConversation.id);
      }

      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error details:", JSON.stringify(error, null, 2));
      setLoading(false);
      alert("שגיאה בהתחלת השיחה. אנא נסה שוב מאוחר יותר.");
    }
  };

  return (
    <>
      {currentUserId ? (
        <Button onClick={handleClick} disabled={loading}>
          {loading ? <Loader2 className='animate-spin w-4 h-4' /> : "התחל שיחה"}
        </Button>
      ) : (
        // Display a message if the user is not logged in
        <Button
          onClick={() =>
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
          }
          disabled={loading}
        >
          עליך להתחבר כדי להתחיל שיחה
        </Button>
      )}
    </>
  );
}
