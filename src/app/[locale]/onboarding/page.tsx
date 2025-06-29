// 'use client'

// import { useRouter } from '@/i18n/navigation'
// import { useSearchParams } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { use } from 'react'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { createClient } from '@/lib/supabase/client'

// const schema = z.object({
//   first_name: z.string().min(1, 'יש להזין שם פרטי'),
//   last_name: z.string().min(1, 'יש להזין שם משפחה'),
//   email: z.string().email('יש להזין כתובת אימייל תקינה'),
//   avatar_url: z.string().url('יש להזין כתובת URL תקינה לתמונה'),
//   phone: z.string().min(6, 'מספר טלפון קצר מדי'),
//   main_address: z.string().min(5, 'כתובת לא תקינה'),
//   community_name: z.string().min(2, 'יש להזין שם קהילה'),
// })

// type FormData = z.infer<typeof schema>

// async function loadUser() {
//   const supabase = createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//   if (!user) throw new Error('Unauthorized')

//   return user
// }

export default function OnboardingPage() {
  // const router = useRouter()
  // const searchParams = useSearchParams()
  // const next = searchParams.get('next')

  // const user = use(loadUser())

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = useForm<FormData>({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     first_name: user?.user_metadata?.full_name?.split(' ')[0] || '',
  //     last_name: user?.user_metadata?.full_name?.split(' ')[1] || '',
  //     email: user?.email || '',
  //     avatar_url: user?.user_metadata?.avatar_url || '',
  //     phone: user?.phone || '',
  //     main_address: '',
  //     community_name: '',
  //   },
  // })

  // const onSubmit = async (data: FormData) => {
  //   const supabase = createClient()
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser()
  //   if (!user) return

  //   const { error } = await supabase
  //     .from('profiles')
  //     .update({
  //       first_name: data.first_name,
  //       last_name: data.last_name,
  //       phone: data.phone,
  //       main_address: { text: data.main_address },
  //       full_name: `${data.first_name} ${data.last_name}`,
  //       community_name: data.community_name,
  //     })
  //     .eq('id', user.id)

  //   if (!error) router.push(next || '/')
  //   else console.error('שגיאה בעדכון הפרופיל:', error)
  // }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      {/* <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>השלמת פרטי פרופיל</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </div>

            <div>
              <Label>שם פרטי</Label>
              <Input {...register('first_name')} />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <Label>שם משפחה</Label>
              <Input {...register('last_name')} />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div>
              <Label>מספר טלפון</Label>
              <Input {...register('phone')} />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label>כתובת</Label>
              <Textarea
                {...register('main_address')}
                rows={2}
              />
              {errors.main_address && (
                <p className="text-red-500 text-sm">
                  {errors.main_address.message}
                </p>
              )}
            </div>

            <div>
              <Label>שם הקהילה</Label>
              <Input {...register('community_name')} />
              {errors.community_name && (
                <p className="text-red-500 text-sm">
                  {errors.community_name.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              שמירה והמשך
            </Button>
          </form>
        </CardContent>
      </Card> */}
    </div>
  )
}
