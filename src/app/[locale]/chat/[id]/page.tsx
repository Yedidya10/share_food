import ChatBox from "@/components/chatBox/ChatBox";
import InboxClient from "@/components/inboxClient/InboxClient";

export default async function ChatPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <div className='flex h-[calc(100vh-160px)]'>
      <div className='w-[320px] border-r bg-background'>
        <InboxClient />
      </div>
      <div className='flex-1 flex flex-col bg-muted/40'>
        <ChatBox chatWithUserId={id} />
      </div>
    </div>
  );
}
