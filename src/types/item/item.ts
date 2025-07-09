import ContactFields from './contact'
import AddressFields from './address'

type ItemBaseFormValues = {
  title: string
  description: string
} & ContactFields &
  AddressFields

// Extend the default form values with images
export type PostItemFormValues = ItemBaseFormValues & {
  images: File[]
  saveAddress: boolean
}

export type EditItemFormValues = ItemBaseFormValues & {
  images: string[]
}
