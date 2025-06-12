// src/app/[locale]/chat/layout.tsx
import InboxClient from "@/components/inboxClient/InboxClient";
import { createClient } from "@/lib/supabase/server";
import { ReactNode } from "react";

export default async function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("User error:", JSON.stringify(userError, null, 2));
    throw new Error("User not authenticated");
  }

  console.log("User ID:", userData.user.id);

  return (
    <div className='flex md:flex-row flex-col h-[calc(100vh-100px)]'>
      <div className='hidden md:block w-[25vw] min-w-[270px] border-r bg-background'>
        <InboxClient userId={userData.user.id} />
      </div>
      <div className='flex-1 bg-muted/40'>{children}</div>
    </div>
  );
}
