'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchCitiesInHebrew(q: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('name_he')
    .ilike('name_he', `${q}%`)
    .limit(5)

  if (error) {
    console.error('Failed to search cities:', error)
    return []
  }

  return data.map((row) => row.name_he)
}

export async function searchStreetsInHebrew(q: string, cityName: string) {
  const supabase = await createClient()

  const { data: cityData, error: cityError } = await supabase
    .from('cities')
    .select('city_code')
    .eq('name_he', cityName)
    .limit(1)
    .single()

  if (cityError || !cityData) {
    console.error('City not found:', cityError)
    return []
  }

  const { data: streets, error: streetsError } = await supabase
    .from('streets')
    .select('name_he')
    .eq('city_code', cityData.city_code)
    .ilike('name_he', `${q}%`)
    .limit(5)

  if (streetsError) {
    console.error('Failed to search streets:', streetsError)
    return []
  }

  return streets.map((row) => row.name_he)
}

export async function validateCity(city: string): Promise<boolean> {
  if (!city || city.trim().length < 2) return false

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cities')
    .select('name_he')
    .eq('name_he', city)
    .limit(1)

  if (error) {
    console.error('validateCity error:', error)
    return false
  }

  return data?.length > 0
}

export async function validateStreet({
  street,
  city,
}: {
  street: string
  city: string
}): Promise<boolean> {
  if (!street || street.length < 2) return false

  const supabase = await createClient()

  const { data: cityData, error: cityError } = await supabase
    .from('cities')
    .select('city_code')
    .eq('name_he', city)
    .limit(1)
    .single()

  if (cityError || !cityData) {
    console.error('City not found:', cityError)
    return false
  }

  const { data: streets, error: streetsError } = await supabase
    .from('streets')
    .select('name_he')
    .eq('city_code', cityData.city_code)
    .eq('name_he', street)
    .limit(1)

  if (streetsError) {
    console.error('Failed to validate street:', streetsError)
    return false
  }

  return streets?.length > 0
}
