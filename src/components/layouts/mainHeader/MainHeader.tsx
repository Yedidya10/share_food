'use client'

import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import AccountMenu from '@/components/accountMenu/AccountMenu'
import { Link, usePathname } from '@/i18n/navigation'
import ChatButton from '@/components/chat/chatButton/ChatButton'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import PostItemFormWrapper from '@/components/forms/postItemForm/PostItemFormWrapper'
import PostItemButton from '@/components/postItemButton/PostItemButton'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { LinkButton } from '@/components/ui/link-button'
import { Badge } from '@/components/ui/badge'

export default function MainHeader() {
  const pathname = usePathname()

  const [user, setUser] = useState<{
    user_metadata: { avatar_url?: string; full_name?: string }
  } | null>(null)
  const [isUserConnected, setIsUserConnected] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean | null>(null)
  const [isPhoneSaved, setIsPhoneSaved] = useState<boolean | null>(null)
  const [isAddressSaved, setIsAddressSaved] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleCreateItemClick = async () => {
    setLoading(true)
    setOpenModal(true)
    setLoading(false)
  }

  const tLogin = useTranslations('header.login')
  const tAccountMenu = useTranslations('header.account_menu')
  const tGenericForm = useTranslations('form.generic')
  const tPostItemForm = useTranslations('form.postItem')
  const tAddressForm = useTranslations('form.address')
  const tCountries = useTranslations('countries')

  useEffect(() => {
    const supabase = createClient()
    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setUser(session?.user || null)
          setIsUserConnected(true)
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsUserConnected(false)
        }
      },
    )

    return () => {
      authData?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isSubmitSuccess) {
      toast.success('הפריט נוצר בהצלחה!', {
        description: 'הפריט יפורסם לאחר אישור המערכת.',
        icon: <CheckCircle className="text-green-500" />,
      })
      setIsSubmitSuccess(null)
    }

    if (isSubmitSuccess === false) {
      toast.error('שגיאה ביצירת הפריט', {
        description: 'אנא נסה שוב מאוחר יותר.',
        icon: <XCircle className="text-red-500" />,
      })
      setIsSubmitSuccess(null)
    }
  }, [isSubmitSuccess])

  useEffect(() => {
    if (isPhoneSaved) {
      toast.success('מספר הטלפון נשמר בהצלחה!', {
        description: 'תוכל להשתמש בו בעתיד ליצירת קשר.',
        icon: <CheckCircle className="text-green-500" />,
      })
      setIsPhoneSaved(null)
    }

    if (isPhoneSaved === false) {
      toast.error('שגיאה בשמירת מספר הטלפון', {
        description: 'ניתן להוסיף טלפון בעמוד פרופיל שלך.',
        icon: <XCircle className="text-red-500" />,
      })
      setIsPhoneSaved(null)
    }
  }, [isPhoneSaved])

  useEffect(() => {
    if (isAddressSaved) {
      toast.success('כתובת נשמרה בהצלחה!', {
        description: 'תוכל להשתמש בה בעתיד ליצירת קשר.',
        icon: <CheckCircle className="text-green-500" />,
      })
      setIsAddressSaved(null)
    }

    if (isAddressSaved === false) {
      toast.error('שגיאה בשמירת הכתובת', {
        description: 'ניתן להוסיף כתובת בעמוד פרופיל שלך.',
        icon: <XCircle className="text-red-500" />,
      })
      setIsAddressSaved(null)
    }
  }, [isAddressSaved])

  return (
    <header className="h-[60px] flex items-center justify-between border-b border-neutral-200  dark:border-neutral-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 h-full p-2 text-lg font-semibold"
        >
          <Image
            src="/icon-192x192.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span className="hidden md:inline">SpareBite</span>
        </Link>
        <Badge
          variant="secondary"
          className="hidden md:inline p-2"
        >
          בהרצה!
        </Badge>
      </div>
      <div className="p-4">
        {user && isUserConnected ? (
          <div className="flex items-center justify-between gap-2">
            <AccountMenu
              translation={{
                welcome: tLogin('welcome', {
                  name: user.user_metadata.full_name?.split(' ')[0] || 'User',
                }),
                logout: tLogin('logout'),
                profile: tAccountMenu('profile'),
                myItems: tAccountMenu('my_items'),
                settings: tAccountMenu('settings'),
              }}
            />
            <ChatButton />
            <PostItemButton
              onClick={() => handleCreateItemClick()}
              disabled={loading}
            />
            <PostItemFormWrapper
              openModal={openModal}
              setIsSubmitSuccess={setIsSubmitSuccess}
              setIsPhoneSaved={setIsPhoneSaved}
              setIsAddressSaved={setIsAddressSaved}
              setOpenModal={setOpenModal}
              translation={{
                formTitle: tPostItemForm('form_title'),
                formDescription: tPostItemForm('form_description'),
                title: tPostItemForm('title'),
                titlePlaceholder: tPostItemForm('title_placeholder'),
                titleRequired: tPostItemForm('title_required'),
                titleMaxLength: tPostItemForm('title_max_length'),
                titleMinLength: tPostItemForm('title_min_length'),
                description: tPostItemForm('description'),
                descriptionPlaceholder: tPostItemForm(
                  'description_placeholder',
                ),
                descriptionRequired: tPostItemForm('description_required'),
                descriptionMaxLength: tPostItemForm('description_max_length'),
                descriptionMinLength: tPostItemForm('description_min_length'),
                uploadImages: tPostItemForm('upload_images'),
                uploadImagesError: tPostItemForm('upload_images_error'),
                addressDetails: tPostItemForm('address_details'),
                streetName: tAddressForm('street_name'),
                streetNamePlaceholder: tAddressForm('street_name_placeholder'),
                streetNameError: tAddressForm('street_name_error'),
                streetNumber: tAddressForm('street_number'),
                streetNumberPlaceholder: tAddressForm(
                  'street_number_placeholder',
                ),
                streetNumberError: tAddressForm('street_number_error'),
                city: tAddressForm('city'),
                cityPlaceholder: tAddressForm('city_placeholder'),
                cityError: tAddressForm('city_error'),
                postalCode: tAddressForm('postal_code'),
                postalCodePlaceholder: tAddressForm('postal_code_placeholder'),
                postalCodeError: tAddressForm('postal_code_error'),
                country: tAddressForm('country'),
                contactDetails: tPostItemForm('contact_details'),
                contactViaSite: tPostItemForm('contact_via_site'),
                phoneNumber: tPostItemForm('phone_number'),
                phoneNumberPlaceholder: tPostItemForm(
                  'phone_number_placeholder',
                ),
                phoneNumberError: tPostItemForm('phone_number_error'),
                isHaveWhatsApp: tPostItemForm('is_have_whatsapp'),
                isHaveWhatsAppTip: tPostItemForm('is_have_whatsapp_tip'),
                email: tPostItemForm('email'),
                emailPlaceholder: tPostItemForm('email_placeholder'),
                emailError: tPostItemForm('email_error'),
                submitButton: tPostItemForm('submit_button'),
                submitButtonProcessing: tPostItemForm(
                  'submit_button_processing',
                ),
                cancel: tGenericForm('cancel'),
                required: tGenericForm('required'),
                reset: tGenericForm('reset'),
                israel: tCountries('israel'),
                requiredError: tGenericForm('required_error'),
                maxLengthError: tGenericForm('max_length_error'),
                minLengthError: tGenericForm('min_length_error'),
                invalidError: tGenericForm('invalid_error'),
                notFoundError: tGenericForm('not_found_error'),
              }}
            />
          </div>
        ) : (
          <>
            <LinkButton
              href={{
                pathname: `/auth/login`,
                query: { redirectTo: pathname },
              }}
              variant="outline"
            >
              {tLogin('login')}
            </LinkButton>
          </>
        )}
      </div>
    </header>
  )
}
