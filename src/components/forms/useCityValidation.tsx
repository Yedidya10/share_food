'use client'

import { useEffect, useState } from 'react'
import { validateCity } from '@/app/actions/locations'

export default function useCityValidation(city: string) {
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (city.length < 2) {
      setIsValid(false)
      return
    }

    validateCity(city.trim()).then((result) => {
      setIsValid(result)
    })
  }, [city])

  return isValid
}
