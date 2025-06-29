import { LoginForm } from '@/components/login-form'
import LoginDialog from '@/components/loginDialog/LoginDialog'

export default async function LoginSlot({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo: string }>
}) {
  const { redirectTo } = await searchParams

  return (
    <LoginDialog>
      <LoginForm redirectTo={redirectTo} />
    </LoginDialog>
  )
}
