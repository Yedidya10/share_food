import { LoginForm } from "@/components/login-form";
import LoginDialog from "@/components/loginDialog/LoginDialog";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <LoginDialog>
      <LoginForm redirectTo={redirect} />
    </LoginDialog>
  );
}
