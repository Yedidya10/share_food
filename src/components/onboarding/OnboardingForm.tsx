'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { use, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button, Input, Avatar, AvatarImage, AvatarFallback, Card, CardHeader, CardTitle, CardContent, Label } from '@/components/ui/
import PhoneInput from '@/components/forms/phoneInput/PhoneInput'
import CityInput from '@/components/forms/address/CityInput'
import StreetInput from '@/components/forms/address/StreetInput'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phoneNumber: z.string().min(6),
  city: z.string().min(1),
  streetName: z.string().min(1),
  streetNumber: z.string().min(1),
  community_name: z.string().min(2),
})

type FormData = z.infer<typeof schema>

export default function OnboardingForm({ user, next }: { user: any, next: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.full_name?.split(' ')[0],
      last_name: user?.full_name?.split(' ')[1],
      phoneNumber:  '',
      city:  '',
      streetName:  '',
      streetNumber: '',
      community_name:  '',
    },
  })

  const importFromGoogle = async () => {
    setLoadingGoogle(true)
    try {
      const {
      data: { session },
    } = use(supabase.auth.getSession())
      const res = use(fetch(
      'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers,addresses',
      {
        headers: {
          Authorization: `Bearer ${session?.provider_token}`,
        },
      }
    ))
      const data = use( res.json())
      if (data.phone) form.setValue('phoneNumber', data.phone)
      if (data.address) {
        form.setValue('city', data.address.city || '')
        form.setValue('streetName', data.address.street || '')
        form.setValue('streetNumber', data.address.number || '')
      }
    } catch (error) {
      console.error( error)
    } finally {
      setLoadingGoogle(false)
    }
 
  }

  const onSubmit = async (values: FormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phoneNumber,
      main_address: {
        city: values.city,
        street: values.streetName,
        number: values.streetNumber,
      },
      full_name: `${values.first_name} ${values.last_name}`,
      community_name: values.community_name,
    }).eq('id', user.id)

    router.push(next)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>השלמת פרטי פרופיל</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </div>

          <Label>שם פרטי</Label>
          <Input {...form.register('first_name')} />

          <Label>שם משפחה</Label>
          <Input {...form.register('last_name')} />

          <Button type="button" onClick={importFromGoogle} disabled={loadingGoogle}>
            {loadingGoogle ? 'מייבא...' : 'ייבוא טלפון וכתובת מגוגל'}
          </Button>

          <PhoneInput/>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <CityInput />
            <StreetInput  />
            <Input {...form.register('streetNumber')} placeholder="מס׳ בית" />
          </div>

          <Label>שם קהילה</Label>
          <Input {...form.register('community_name')} />

          <Button type="submit" className="w-full">שמירה והמשך</Button>
        </form>
      </CardContent>
    </Card>
  )
}