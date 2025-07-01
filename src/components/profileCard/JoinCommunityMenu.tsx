'use client'

import { useState } from 'react'

export default function JoinCommunityMenu({ userId }: { userId: string }) {
  const [community, setCommunity] = useState('')
  const [note, setNote] = useState('')

  const handleRequest = async () => {
    await fetch('/api/profile/request-join-community', {
      method: 'POST',
      body: JSON.stringify({ userId, community, note }),
    })
    setCommunity('')
    setNote('')
  }

  return (
    <div className="flex gap-1">
      <input
        value={community}
        onChange={(e) => setCommunity(e.target.value)}
        placeholder="Community name"
        className="border rounded px-1 text-xs"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Request note"
        className="border rounded px-1 text-xs"
      />
      <button
        onClick={handleRequest}
        className="bg-blue-500 text-white px-2 rounded text-xs"
      >
        Join
      </button>
    </div>
  )
}
