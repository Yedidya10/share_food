import InboxClient from "@/components/chat/inboxClient/InboxClient";
import { createClient } from "@/lib/supabase/server";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("User error:", JSON.stringify(userError, null, 2));
    throw new Error("User not authenticated");
  }

  return (
    <>
      <div className='hidden md:flex flex-col items-center justify-center h-full'>
        <p className='text-lg font-medium mb-4'>
          לחץ על שיחה בצד ימין כדי להתחיל לשוחח.
        </p>
      </div>
      <div className='md:hidden block w-full border-r bg-background'>
        <InboxClient userId={userData.user.id} />
      </div>
    </>
  );
}
