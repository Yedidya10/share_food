import type { Database as OriginalDatabase } from './supabase'

/** Utility */
type RemoveNullability<T, Keys extends keyof T> = {
  [K in keyof T]: K extends Keys ? NonNullable<T[K]> : T[K]
}

/** MainAddress type */
type MainAddress = {
  street_number: string
  street_name: string
  city: string
  country: string
  postal_code?: string
}

/** get_items_nearby fix */
type OriginalNearbyItem =
  OriginalDatabase['public']['Functions']['get_items_nearby']['Returns'][number]
type FixedNearbyItem = RemoveNullability<
  OriginalNearbyItem,
  'id' | 'user_id' | 'title' | 'description' | 'city' | 'country' | 'created_at'
>

/** active_items view fix */
type OriginalActiveItem =
  OriginalDatabase['public']['Views']['active_items']['Row']
type FixedActiveItem = RemoveNullability<
  OriginalActiveItem,
  'id' | 'user_id' | 'title' | 'description' | 'city' | 'country' | 'created_at'
>

/** profiles table fix */
type OriginalProfile = OriginalDatabase['public']['Tables']['profiles']['Row']
type FixedProfile = Omit<OriginalProfile, 'main_address'> & {
  main_address: MainAddress | null
}

/** Combined Database type */
type Database = Omit<OriginalDatabase, 'public'> & {
  public: Omit<OriginalDatabase['public'], 'Functions' | 'Views' | 'Tables'> & {
    Functions: Omit<
      OriginalDatabase['public']['Functions'],
      'get_items_nearby'
    > & {
      get_items_nearby: {
        Args: OriginalDatabase['public']['Functions']['get_items_nearby']['Args']
        Returns: FixedNearbyItem[]
      }
    }
    Views: Omit<OriginalDatabase['public']['Views'], 'active_items'> & {
      active_items: {
        Row: FixedActiveItem
      }
    }
    Tables: Omit<OriginalDatabase['public']['Tables'], 'profiles'> & {
      profiles: {
        Row: FixedProfile
        Insert: OriginalDatabase['public']['Tables']['profiles']['Insert']
        Update: OriginalDatabase['public']['Tables']['profiles']['Update']
      }
    }
  }
}

export type {
  Database,
  FixedNearbyItem,
  FixedActiveItem,
  MainAddress,
  FixedProfile,
}
