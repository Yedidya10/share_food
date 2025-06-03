"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  targetUserId: string;
};

export function StartChatButton({ targetUserId }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current user id on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: sessionData }) => {
      setCurrentUserId(sessionData?.session?.user.id ?? null);
    });
  }, []);

  const handleClick = async () => {
    if (!currentUserId) return;

    setLoading(true);
    router.push(`/chat/${targetUserId}`);
  };

  return (
    <Button onClick={handleClick} disabled={loading || !currentUserId}>
      {loading ? <Loader2 className='animate-spin w-4 h-4' /> : "התחל שיחה"}
    </Button>
  );
}
