"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  targetUserId: string;
};

export default function StartChatButton({ targetUserId }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

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
      const { data: conversations, error: selectError } = await supabase
        .from("conversations")
        .select("id, members")
        .contains("members", members);

      if (selectError) throw selectError;

      let conversationIdToNavigate: string;

      const existingConversation = conversations?.find((conv) => {
        if (conv.members.length !== members.length) return false;
        for (let i = 0; i < members.length; i++) {
          if (conv.members[i] !== members[i]) return false;
        }
        return true;
      });

      if (existingConversation) {
        conversationIdToNavigate = existingConversation.id;
      } else {
        const { data: newConversation, error: insertError } = await supabase
          .from("conversations")
          .insert({ members })
          .select()
          .single();

        if (insertError) throw insertError;

        conversationIdToNavigate = newConversation.id;
      }

      router.push(`/chat/${conversationIdToNavigate}`);
    } catch (error) {
      console.error("Error details:", JSON.stringify(error, null, 2));
      alert("שגיאה בהתחלת השיחה. אנא נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? <Loader2 className='animate-spin w-4 h-4' /> : "התחל שיחה"}
    </Button>
  );
}
