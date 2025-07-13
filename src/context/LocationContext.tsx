// src/context/LocationContext.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'

export type DistanceType = 'profile' | 'manual' | 'geo'

type LocationContextType = {
  distanceType: DistanceType
  setDistanceType: (type: DistanceType) => void
  manualAddress: string
  setManualAddress: (address: string) => void
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
)

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [distanceType, setDistanceType] = useState<DistanceType>('profile')
  const [manualAddress, setManualAddress] = useState('')

  return (
    <LocationContext.Provider
      value={{ distanceType, setDistanceType, manualAddress, setManualAddress }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocationContext = () => {
  const context = useContext(LocationContext)
  if (!context)
    throw new Error('useLocationContext must be used within a LocationProvider')
  return context
}
