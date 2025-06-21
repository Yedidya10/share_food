import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <div className='bg-muted flex min-h-[calc(100svh-60px)] flex-col items-center justify-center gap-6 p-6'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <LoginForm redirectTo={redirect} />
      </div>
    </div>
  );
}
