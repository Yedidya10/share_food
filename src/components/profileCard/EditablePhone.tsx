'use client'

import { useState } from 'react'

export default function EditablePhone({
  phone,
  userId,
}: {
  phone: string
  userId: string
}) {
  const [value, setValue] = useState(phone)
  const [editing, setEditing] = useState(false)

  const handleSave = async () => {
    await fetch('/api/profile/update-phone', {
      method: 'POST',
      body: JSON.stringify({ userId, phone: value }),
    })
    setEditing(false)
  }

  return editing ? (
    <div className="flex gap-1">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded px-1 text-sm"
      />
      <button
        onClick={handleSave}
        className="text-xs text-blue-500"
      >
        Save
      </button>
    </div>
  ) : (
    <p
      className="text-sm text-gray-700 cursor-pointer"
      onClick={() => setEditing(true)}
    >
      {value || 'Add phone'}
    </p>
  )
}
