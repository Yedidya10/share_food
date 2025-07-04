export type FormErrorTranslationType = {
  maxLengthError: string
  minLengthError: string
  requiredError: string
  notFoundError: string
  invalidError: string
}

export type AddressFormTranslationBase = {
  addressDetails: string
  streetName: string
  streetNamePlaceholder: string
  streetNameError: string
  streetNumber: string
  streetNumberPlaceholder: string
  streetNumberError: string
  city: string
  cityPlaceholder: string
  cityError: string
  country: string
  postalCode: string
  postalCodePlaceholder: string
  postalCodeError: string
  saveAddress: string
  saveAddressTip: string
  saveAddressError: string
}

export type PhoneFieldTranslationBase = {
  phoneNumber: string
  phoneNumberPlaceholder: string
  phoneNumberError: string
  isHaveWhatsApp: string
  isHaveWhatsAppTip: string
}

export type EmailFormTranslationBase = {
  email: string
  emailPlaceholder: string
  emailError: string
}

export type ContactFormTranslationBase = {
  contactViaSite: string
  contactByPhone: string
  contactByEmail: string
  savePhone: string
  savePhoneTip: string
} & PhoneFieldTranslationBase &
  EmailFormTranslationBase

export type AddressFormTranslationFull = AddressFormTranslationBase &
  FormErrorTranslationType

export type PhoneFieldTranslationFull = PhoneFieldTranslationBase &
  FormErrorTranslationType

export type FormTranslationType = {
  formTitle: string
  formDescription: string
  title: string
  titlePlaceholder: string
  titleRequired: string
  titleMinLength: string
  titleMaxLength: string
  description: string
  descriptionPlaceholder: string
  descriptionRequired: string
  descriptionMinLength: string
  descriptionMaxLength: string
  uploadImages: string
  uploadImagesError: string
  submitButton: string
  submitButtonProcessing: string
  cancel: string
  required: string
  reset: string
  israel: string
} & AddressFormTranslationBase &
  ContactFormTranslationBase &
  FormErrorTranslationType
