'use client'

import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteUser } from '@/app/actions/deleteUser'
import { useRouter } from '@/i18n/navigation'
import { toast } from 'sonner'

export default function DeleteUserAccount({
  userId,
  locale,
}: {
  userId: string
  locale: string
}) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const route = useRouter()

  useEffect(() => {
    // Fetch the current user data
    const fetchUserId = async () => {
      try {
      } catch (error) {
        console.error('Error fetching user ID:', error)
      }
    }
    fetchUserId()
  }, [])

  const handleDeleteUserAccount = async (userId: string) => {
    setIsDeleting(true)

    const toastId = toast.loading('מוחק חשבון…', {
      duration: Infinity,
    })

    try {
      const response = await deleteUser(userId)

      if (response?.success) {
        setIsDeleting(false)
        toast.success('החשבון נמחק בהצלחה', { id: toastId })
        route.push('/')
      } else {
        toast.error(response?.message || 'נכשל למחוק את החשבון', {
          id: toastId,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('שגיאה במחיקת החשבון', { id: toastId })
    }
  }

  return (
    <div className="flex flex-col border p-4 rounded-lg bg-white shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4">מחיקת חשבון משתמש</h2>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isDeleting}
            className="max-w-[200px]"
          >
            {isDeleting ? 'מוחק...' : 'מחק חשבון'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={locale === 'he' ? 'text-right' : 'text-left'}
            >
              האם אתה בטוח?
            </AlertDialogTitle>
            <AlertDialogDescription
              className={locale === 'he' ? 'text-right' : 'text-left'}
            >
              מחיקת החשבון שלך היא פעולה בלתי הפיכה. כל הנתונים הקשורים לחשבון
              זה, כולל הודעות, תמונות ופרטים אישיים, יימחקו לצמיתות. האם אתה
              בטוח שברצונך להמשיך?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="text-white"
                onClick={() => handleDeleteUserAccount(userId)}
                disabled={isDeleting}
              >
                {isDeleting ? 'מוחק...' : 'אישור'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
