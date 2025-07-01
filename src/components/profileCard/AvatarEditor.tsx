'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Trash } from 'lucide-react'
import { Button } from '../ui/button'

export default function AvatarEditor({
  avatarUrl,
  userId,
}: {
  avatarUrl: string
  userId: string
}) {
  const [hovered, setHovered] = useState(false)

  const handleUpload = async () => {
    // לפתוח דיאלוג העלאה שלך
  }

  const handleRemove = async () => {
    await fetch('/api/profile/remove-avatar', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
    // רענון או עדכון סטייט
  }

  return (
    <div
      className="relative w-30 h-30 rounded-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
          No Avatar
        </div>
      )}

      {hovered && (
        <div className="absolute inset-0 bg-black/40 flex gap-2 items-center justify-center text-white text-xs">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpload}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <Trash />
          </Button>
        </div>
      )}
    </div>
  )
}
