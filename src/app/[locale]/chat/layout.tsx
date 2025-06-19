// src/app/[locale]/chat/layout.tsx
import InboxClient from "@/components/chat/inboxClient/InboxClient";
import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex md:flex-row flex-col h-[calc(100vh-80px)]'>
      <InboxClient />
      <div className='flex-1 bg-muted/40'>{children}</div>
    </div>
  );
}
