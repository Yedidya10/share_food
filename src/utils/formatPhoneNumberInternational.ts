import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'

export default function formatPhoneNumberInternational(
  rawPhone?: string | null,
) {
  if (!rawPhone) return ''

  try {
    // ננסה לפרסר את המספר (יכול להיות עם או בלי פלוס)
    const phoneNumber = parsePhoneNumberFromString(
      rawPhone.startsWith('+') ? rawPhone : '+' + rawPhone,
    )

    if (phoneNumber) {
      // נוכל לבחור פורמט קצר (National) או ארוך (International)
      return phoneNumber.formatNational() // לדוגמה: 054-830-7675
      // או phoneNumber.formatInternational() -> ‎+972 54-830-7675
    } else {
      // fallback - פורמט בסיסי עם מקפים
      return new AsYouType().input(rawPhone)
    }
  } catch (error) {
    console.error('Invalid phone number:', error)
    return rawPhone
  }
}
