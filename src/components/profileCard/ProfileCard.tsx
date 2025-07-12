'use client'

import Image from 'next/image'
import EditableField from '@/components/forms/editableField/EditableField'
import { Button } from '../ui/button'
import AddressUpdateForm from '../forms/addressUpdateForm/AddressUpdateForm'
import PhoneUpdateForm from '../forms/phoneUpdateForm/PhoneUpdateForm'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AtSignIcon, Home, Pencil, Phone } from 'lucide-react'
import { useUpdateProfileField } from '@/hooks/db/useUpdateProfileField'
import formatPhoneNumberInternational from '@/utils/formatPhoneNumberInternational'
import AvatarUpdateForm from '../forms/avatarUpdateForm/AvatarUpdateForm'

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
  const [isOpenAvatarModal, setOpenAvatarModal] = useState(false)
  const [isSubmitAddressSuccess, setIsSubmitAddressSuccess] = useState<
    null | boolean
  >(null)
  const [isOpenPhoneModal, setOpenPhoneModal] = useState(false)
  const [isSubmitPhoneSuccess, setIsSubmitPhoneSuccess] = useState<
    null | boolean
  >(null)

  const { mutateAsync: updateUserField } = useUpdateProfileField()

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

  const saveUserName = async (userName: string) => {
    try {
      const response = await updateUserField({
        field: 'user_name',
        value: userName,
      })
      if (response?.success)
        toast.success(translations.toastTranslations.userNameUpdated)
    } catch (error) {
      console.error('Error updating user name:', error)
      toast.error(translations.toastTranslations.userNameUpdateFailed)
    }
  }

  const saveUserEmail = async (email: string) => {
    try {
      const response = await updateUserField({ field: 'email', value: email })
      if (response?.success)
        toast.success(translations.toastTranslations.emailUpdated)
    } catch (error) {
      console.error('Error updating email:', error)
      toast.error(translations.toastTranslations.emailUpdateFailed)
    }
  }

  return (
    <div
      className="rounded-xl shadow dark:shadow-gray-800/50
       p-6 flex flex-col lg:flex-row lg:justify-between gap-6 items-start rtl:text-right"
    >
      {/* Header */}
      <div className="flex flex-3 flex-row md:items-start items-center gap-6">
        <div className="relative  w-24 h-24 md:w-32 md:h-32 rounded-full group">
          <Image
            src={user.avatarUrl}
            alt="avatar"
            fill
            className="object-cover rounded-full"
          />
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenAvatarModal(true)}
            className="absolute bottom-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Change avatar"
          >
            <Camera size={16} />
          </Button> */}
          <AvatarUpdateForm
            openModal={isOpenAvatarModal}
            setOpenModal={setOpenAvatarModal}
            onSubmitSuccess={() => {
              setOpenAvatarModal(false)
              toast.success(translations.toastTranslations.avatarUpdated)
            }}
            avatarUrl={user.avatarUrl}
            userId={user.id}
            translation={{
              avatarUpdated: translations.toastTranslations.avatarUpdated,
              avatarUpdateFailed:
                translations.toastTranslations.avatarUpdateFailed,
            }}
          />
        </div>
        <div className="flex-1 p-2 space-y-2">
          <EditableField
            value={user.fullName}
            placeholder="User Name"
            onSave={saveUserName}
            className="text-2xl font-semibold"
            inputClassName="md:text-2xl py-2"
          />
          <p className="ps-2 text-sm">
            תאריך הצטרפות:{' '}
            {new Date(user.createdAt).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col divide-y rounded-md overflow-hidden">
        {/* Email */}
        <div className="md:grid md:grid-cols-[30px_120px_auto_30px] flex items-center gap-3 py-3 px-4">
          <AtSignIcon
            className=" "
            size={18}
          />
          <span className="font-medium">
            {translations.emailTranslations.email}
          </span>
          <EditableField
            value={user.email}
            placeholder={translations.emailTranslations.emailPlaceholder}
            onSave={saveUserEmail}
            className="md:justify-self-start"
          />
        </div>

        {/* Phone */}
        <div className="md:grid md:grid-cols-[30px_120px_auto_30px] flex items-center gap-3 py-3 px-4">
          <Phone
            className=""
            size={18}
          />
          <span className="font-medium">
            {translations.phoneTranslations.phoneNumber}
          </span>
          <span className="ps-2">
            {formatPhoneNumberInternational(user.phone) ||
              translations.phoneTranslations.noPhoneNumberProvided}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit phone number"
            onClick={() => setOpenPhoneModal(true)}
          >
            <Pencil size={16} />
          </Button>
          <PhoneUpdateForm
            openModal={isOpenPhoneModal}
            setOpenModal={setOpenPhoneModal}
            onSubmitSuccess={setIsSubmitPhoneSuccess}
            initialValues={{ phoneNumber: user.phone, isHaveWhatsApp: false }}
            translation={{
              ...translations.phoneTranslations,
              ...translations.genericTranslations,
            }}
          />
        </div>

        {/* Address */}
        <div className="md:grid md:grid-cols-[30px_120px_auto_30px] flex items-center gap-3 py-3 px-4">
          <Home
            className=" "
            size={18}
          />
          <span className="font-medium">
            {translations.addressTranslations.addressDetails}
          </span>
          <span
            className={`ps-2 ${
              user.address.streetName &&
              user.address.streetNumber &&
              user.address.city
                ? ''
                : 'dark:text-gray-700 text-gray-500'
            }`}
          >
            {user.address.streetName &&
            user.address.streetNumber &&
            user.address.city
              ? `${user.address.streetName} ${user.address.streetNumber}, ${user.address.city}, ${user.address.country}`
              : translations.addressTranslations.noAddressProvided}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit address"
            onClick={() => setOpenAddressModal(true)}
          >
            <Pencil size={16} />
          </Button>
          <AddressUpdateForm
            openModal={isOpenAddressModal}
            setOpenModal={setOpenAddressModal}
            onSubmitSuccess={setIsSubmitAddressSuccess}
            initialValues={{
              streetName: user.address.streetName || '',
              streetNumber: user.address.streetNumber || '',
              city: user.address.city || '',
              country:
                user.address.country || translations.addressTranslations.israel, // Default
              postalCode: user.address.postalCode || '',
            }}
            translation={{
              ...translations.addressTranslations,
              ...translations.genericTranslations,
            }}
          />
        </div>
      </div>
    </div>
  )
}
