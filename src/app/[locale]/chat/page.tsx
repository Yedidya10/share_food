import InboxClient from "@/components/chat/inboxClient/InboxClient";
import { createClient } from "@/lib/supabase/server";

export default async function ChatPage() {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData || !userData.user) {
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
          <InboxClient />
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
  }
}
