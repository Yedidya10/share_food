import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import ThemeProvider from "@/components/theme/ThemeProvider";
import "./globals.css";
import OneTapComponent from "@/components/OneTapComponent";
import MainHeader from "@/components/layouts/mainHeader/MainHeader";
import FeedbackButton from "@/components/feedbackButton/FeedbackButton";
import QueryProvider from "@/lib/reactQuery/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Share Food",
  keywords: [
    "food waste",
    "food rescue",
    "food donation",
    "sustainability",
    "community support",
    "save food",
    "food security",
  ],
  description:
    "Share Food is a platform dedicated to reducing food waste by connecting those with surplus food to those in need. Join us in our mission to create a sustainable future by rescuing food and supporting communities.",
  openGraph: {
    title: "Share Food",
    description:
      "Share Food is a platform dedicated to reducing food waste by connecting those with surplus food to those in need. Join us in our mission to create a sustainable future by rescuing food and supporting communities.",
    url: "https://savefood.org",
    siteName: "Save Food",
    images: [
      {
        url: "https://savefood.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Save Food - Reduce Food Waste",
      },
    ],
    locale: "he_IL",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  login,
  params,
}: Readonly<{
  children: React.ReactNode;
  login: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html lang={locale} suppressHydrationWarning={true} dir={dir}>
      <head>
        <link rel='manifest' href='/manifest.webmanifest' />
        <link rel='icon' href='/icon-192x192.png' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <OneTapComponent />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <QueryProvider>
              <MainHeader />
              <Toaster
                position='top-center'
                richColors
                closeButton={false}
                toastOptions={{
                  className:
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  style: {
                    borderRadius: "8px",
                    padding: "16px",
                  },
                }}
              />
              <div className='pt-[80px] m-0 ' />
              {children}
              {login}
              <FeedbackButton />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
