'use client'

import { useState } from 'react'

export default function EditableName({
  firstName,
  lastName,
  userId,
}: {
  firstName: string
  lastName: string
  userId: string
}) {
  const [first, setFirst] = useState(firstName)
  const [last, setLast] = useState(lastName)

  const handleBlur = async () => {
    await fetch('/api/profile/update-name', {
      method: 'POST',
      body: JSON.stringify({ userId, firstName: first, lastName: last }),
    })
  }

  return (
    <div className="flex gap-1 text-xl font-semibold">
      <input
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        onBlur={handleBlur}
        className="bg-transparent border border-gray-300 focus:border-blue-500  rounded px-3 py-1 mr-1"
      />
      <input
        value={last}
        onChange={(e) => setLast(e.target.value)}
        onBlur={handleBlur}
        className="bg-transparent border border-gray-300 focus:border-blue-500  rounded px-3 py-1"
      />
    </div>
  )
}
