import ChatBox from "@/components/chatBox/ChatBox";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{
    id?: string;
  }>;
}) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("User error:", JSON.stringify(userError, null, 2));
    throw new Error("User not authenticated");
  }

  const { id: conversationId } = await params;
  if (!conversationId) {
    console.error("No conversation ID provided");
    redirect("/chat");
  }

  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    throw new Error("Failed to load messages");
  }

  console.log("Messages data:", messagesData);
  return (
    <div className='flex h-[calc(100vh-160px)]'>
      <div className='flex-1 flex flex-col bg-muted/40'>
        <div className='p-4 text-muted-foreground'>
          <ChatBox
            conversationId={conversationId}
            userId={userData.user.id}
            initialMessages={messagesData || []}
          />
        </div>
      </div>
    </div>
  );
}
