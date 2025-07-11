import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import ThemeProvider from '@/components/theme/ThemeProvider'
import './globals.css'
import OneTapComponent from '@/components/OneTapComponent'
import MainHeader from '@/components/layouts/mainHeader/MainHeader'
// import FeedbackButton from '@/components/feedbackButton/FeedbackButton'
import QueryProvider from '@/lib/reactQuery/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import WelcomeEmailEffect from '@/components/WelcomeEmailEffect'
import { LocationProvider } from '@/context/LocationContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

type Params = Promise<{ locale: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale } = await params

  // Fallback to 'he' if locale is not supported
  const supportedLocales = ['he', 'en']
  const currentLocale = supportedLocales.includes(locale) ? locale : 'he'

  // Localized metadata
  const metaByLocale: Record<
    string,
    { title: string; description: string; url: string; ogLocale: string }
  > = {
    he: {
      title: 'SpareBite - שיתוף מזון',
      description:
        'SpareBite היא פלטפורמה לשיתוף מזון, שמטרתה להפחית את בזבוז המזון על ידי חיבור בין אנשים עם עודפי מזון לבין אלה שיכולים להשתמש בו.',
      url: 'https://sparebite.com/he',
      ogLocale: 'he_IL',
    },
    en: {
      title: 'SpareBite - Share Food',
      description:
        'SpareBite is a platform dedicated to reducing food waste by connecting those with surplus food to those who can use it.',
      url: 'https://sparebite.com/en',
      ogLocale: 'en_US',
    },
  }
  const meta = metaByLocale[currentLocale]

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL('https://sparebite.com'),
    keywords: [
      'food waste',
      'food rescue',
      'food donation',
      'sustainability',
      'community support',
      'save food',
      'food security',
    ],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.url,
      siteName: 'SpareBite',
      images: [
        {
          url: 'https://sparebite.com/icon-512x512.png',
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale: meta.ogLocale,
      type: 'website',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
  auth,
  editItem,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
  auth: React.ReactNode
  editItem: React.ReactNode
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const dir = locale === 'he' ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      suppressHydrationWarning={true}
      dir={dir}
    >
      <head>
        <link
          rel="manifest"
          href="/manifest.webmanifest"
        />
        <link
          rel="icon"
          href="/icon-192x192.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <OneTapComponent />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <QueryProvider>
              <LocationProvider>
                <WelcomeEmailEffect />
                <MainHeader />
                <Toaster
                  position="top-center"
                  richColors
                  closeButton={false}
                  toastOptions={{
                    className:
                      'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                    style: {
                      borderRadius: '8px',
                      padding: '16px',
                    },
                  }}
                />
                {auth}
                {editItem}
                {children}
                {/* <FeedbackButton /> */}
              </LocationProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
