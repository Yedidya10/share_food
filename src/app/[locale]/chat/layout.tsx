import InboxClient from "@/components/chat/inboxClient/InboxClient";
import { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className='h-[calc(100vh-60px)]'>
      {/* Desktop view for InboxClient */}
      <div className='hidden md:flex flex-row h-full'>
        <InboxClient />
        <div className='flex-1 bg-muted/40'>{children}</div>
      </div>

      {/* Mobile view for InboxClient */}
      <div className='flex md:hidden h-full'>{children}</div>
    </div>
  );
}
