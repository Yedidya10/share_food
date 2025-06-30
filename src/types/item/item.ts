import ContactFields from './contact'
import AddressFields from './address'

type ItemBaseFormValues = {
  title: string
  description: string
} & ContactFields &
  AddressFields

export enum ItemStatusEnum {
  Draft = 'draft',
  PendingPublication = 'pending_publication',
  Published = 'published',
  UpdatePending = 'update_pending',
  GivenAway = 'given_away',
  Rejected = 'rejected',
  Expired = 'expired',
}

export type DbItem = {
  user_id: string
  id: string
  title: string
  description: string
  category?: string
  images: string[]
  full_name: string
  street_name: string
  street_number: string
  city: string
  postal_code?: string
  country: string
  phone_number?: string
  is_have_whatsapp: boolean
  email?: string
  status: ItemStatusEnum
  updated_at: Date
  created_at: Date
  published_at: Date | null
}

export type DbFoodItem = DbItem & {
  expiration_date: string
}

// Extend the default form values with images
export type PostItemFormValues = ItemBaseFormValues & {
  images: File[]
  saveAddress: boolean // Optional, defaults to false
}

export type EditItemFormValues = ItemBaseFormValues & {
  images: string[]
}
