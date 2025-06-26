import dayjs from 'dayjs'

export default function MessageBubble({
  msg,
  isOwn,
}: {
  msg: { content: string; created_at: string }
  isOwn: boolean
}) {
  return (
    <div
      className={`px-3 py-2 text-sm rounded-xl shadow-sm w-fit max-w-[75%] mb-1 flex flex-col ${
        isOwn
          ? 'bg-primary/20 text-primary self-end'
          : 'bg-muted text-muted-foreground self-start'
      }`}
    >
      <div>{msg.content}</div>
      <div className="text-[10px] text-right text-gray-500 mt-1">
        {dayjs(msg.created_at).format('HH:mm')}
      </div>
    </div>
  )
}
