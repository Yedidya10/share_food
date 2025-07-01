'use client'

import { FormTranslationType } from '@/types/formTranslation'
import dynamic from 'next/dynamic'

const PostItemForm = dynamic(() => import('../postItemForm/PostItemForm'), {
  ssr: false,
})

export default function PostItemFormWrapper(props: {
  translation: FormTranslationType
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setIsSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>
  setIsPhoneSaved: React.Dispatch<React.SetStateAction<boolean | null>>
  setIsAddressSaved: React.Dispatch<React.SetStateAction<boolean | null>>
}) {
  if (!props.openModal) return null

  return <PostItemForm {...props} />
}
