export type UnifiedImage = {
  /** מזהה ייחודי (קיים או חדש) */
  id?: string
  /** תמיד קיים: עבור תצוגה */
  url?: string
  /** רק לתמונות חדשות */
  file?: File
  /** hash SHA-256 של התוכן (לפונקציות כמו מניעת כפילויות) */
  hash?: string
}
