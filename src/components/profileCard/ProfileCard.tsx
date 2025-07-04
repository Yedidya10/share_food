'use client'

type ProfileCard = {
  id: string
  email: string
  createdAt: string
  phone: string
  fullName: string
  address: {
    streetName?: string
    streetNumber?: string
    city?: string
    country?: string
    postalCode?: string
  }
  avatarUrl: string
}

import Image from 'next/image'
import EditableField from '@/components/forms/editableField/EditableField'
import { Button } from '../ui/button'
import AddressUpdateForm from '../forms/addressUpdateForm/AddressUpdateForm'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Phone } from 'lucide-react'
import PhoneUpdateForm from '../forms/phoneUpdateForm/PhoneUpdateForm'
import { useUpdateProfileField } from '@/hooks/db/useUpdateProfileField'

export default function ProfileCard({
  user,
  translations,
}: {
  user: ProfileCard
  // TODO: Define a proper type for translations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: any
}) {
  const [isOpenAddressModal, setOpenAddressModal] = useState(false)
  const [isSubmitAddressSuccess, setIsSubmitAddressSuccess] = useState<
    null | boolean
  >(null)
  const [isOpenPhoneModal, setOpenPhoneModal] = useState(false)
  const [isSubmitPhoneSuccess, setIsSubmitPhoneSuccess] = useState<
    null | boolean
  >(null)

  useEffect(() => {
    if (isSubmitAddressSuccess) {
      setOpenAddressModal(false)
      setIsSubmitAddressSuccess(null)
    }
  }, [isSubmitAddressSuccess])

  useEffect(() => {
    if (isSubmitPhoneSuccess) {
      setOpenPhoneModal(false)
      setIsSubmitPhoneSuccess(null)
    }
  }, [isSubmitPhoneSuccess])

  const { mutateAsync: updateUserField } = useUpdateProfileField()

  const saveUserName = async (userName: string) => {
    try {
      const response = await updateUserField({
        field: 'user_name',
        value: userName,
      })

      if (response?.success) {
        toast.success('User name updated successfully')
      }
    } catch (error) {
      console.error('Error updating user name:', error)
      toast.error('Failed to update user name')
    }
  }

  const saveUserEmail = async (email: string) => {
    try {
      const response = await updateUserField({
        field: 'email',
        value: email,
      })

      if (response?.success) {
        toast.success('Email updated successfully')
      }
    } catch (error) {
      console.error('Error updating email:', error)
      toast.error('Failed to update email')
    }
  }

  return (
    <div className="rounded-xl shadow p-8 flex gap-8 items-start space-between w-full">
      {/* Header */}
      <div className="w-full flex items-start gap-6">
        <div className="relative w-40 h-40 rounded-full overflow-hidden group">
          <Image
            src={user.avatarUrl}
            alt="avatar"
            fill
            className="object-cover"
          />
          {/* overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm cursor-pointer">
            Change
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {/* First + Last */}
          <div className="flex gap-2">
            <EditableField
              value={user.fullName}
              placeholder="User Name"
              onSave={saveUserName}
              className="text-2xl"
              inputClassName="w-[max-content] md:text-2xl py-5"
            />
          </div>
          <p className="text-sm text-gray-500">
            תאריך הצטרפות:{' '}
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="w-120 grid grid-cols-1 pe-5 gap-x-12 gap-y-4">
        <div className="w-full flex items-center gap-3">
          <span className=" w-20">Email</span>
          <EditableField
            value={user.email}
            placeholder={translations.emailTranslations.emailPlaceholder}
            onSave={saveUserEmail}
            className="flex-1 "
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Phone />
          <span className=" w-20">Phone</span>
          {user.phone || 'No phone number provided'}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit phone number"
            onClick={() => {
              setOpenPhoneModal(true)
            }}
          >
            <Pencil />
          </Button>
          <PhoneUpdateForm
            openModal={isOpenPhoneModal}
            setOpenModal={setOpenPhoneModal}
            onSubmitSuccess={setIsSubmitPhoneSuccess}
            initialValues={{
              phoneNumber: user.phone,
              isHaveWhatsApp: false, // Assuming this is a default value, adjust as needed
            }}
            translation={
              translations.phoneTranslations
            } /* Replace with a valid PhoneFormTranslationFull object */
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="w-20">כתובת</span>
          {user.address.streetName &&
          user.address.streetNumber &&
          user.address.city
            ? user.address.streetName +
              ' ' +
              user.address.streetNumber +
              ', ' +
              user.address.city +
              ', ' +
              user.address.country
            : 'No address provided'}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit address"
            onClick={() => {
              setOpenAddressModal(true)
            }}
          >
            <Pencil />
          </Button>
          <AddressUpdateForm
            openModal={isOpenAddressModal}
            setOpenModal={setOpenAddressModal}
            onSubmitSuccess={setIsSubmitAddressSuccess}
            initialValues={{
              streetName: user.address.streetName || '', // Placeholder, adjust as needed
              streetNumber: '', // Placeholder, adjust as needed
              city: '', // Placeholder, adjust as needed
              country: '', // Placeholder, adjust as needed
              postalCode: '', // Placeholder, adjust as needed
            }}
            translation={
              translations.addressTranslations
            } /* Replace with a valid AddressFormTranslationFull object */
          />
        </div>
      </div>
    </div>
  )
}
