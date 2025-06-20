import ChatBox from "@/components/chat/chatBox/ChatBox";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";

export default async function ChatThread({
  params,
}: {
  params: Promise<{
    chatId: string;
    locale: string;
  }>;
}) {
  try {
    const { chatId: conversationId, locale } = await params;

    if (!conversationId || conversationId === "null") {
      console.error("Invalid conversation ID");
      redirect({ href: "/chat", locale });
    }

    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("Failed to fetch user data");
    }

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id, members")
      .eq("id", conversationId)
      .single();

    if (conversationError || !conversation) {
      throw new Error("Conversation not found");
    }

    const otherUserId = conversation.members.find(
      (memberId: string) => memberId !== userData.user.id
    );

    if (!otherUserId) throw new Error("Other user not found");

    const { data: otherUser, error: otherUserError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", otherUserId)
      .single();

    if (otherUserError) throw new Error("Failed to fetch other user");

    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    console.log("Messages data:", messagesData);

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      throw new Error("Failed to load messages");
    }

    return (
      <div className='flex flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden'>
        <ChatBox
          otherUser={otherUser}
          conversationId={conversationId}
          userId={userData.user.id}
          initialMessages={messagesData || []}
        />
      </div>
    );
  } catch (error) {
    console.error(error);
  }
}
