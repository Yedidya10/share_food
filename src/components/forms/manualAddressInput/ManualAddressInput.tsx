// src/components/forms/ManualAddressInput.tsx
'use client'

import { Input } from '@/components/ui/input'
import { useLocationContext } from '@/context/LocationContext'
import { Label } from '@/components/ui/label'

export default function ManualAddressInput() {
  const { manualAddress, setManualAddress } = useLocationContext()

  return (
    <div className="grid gap-2">
      <Label>כתובת ידנית</Label>
      <Input
        placeholder="הזן כתובת"
        value={manualAddress}
        onChange={(e) => setManualAddress(e.target.value)}
      />
    </div>
  )
}
