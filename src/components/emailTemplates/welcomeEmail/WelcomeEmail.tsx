import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import type * as React from 'react'

interface WelcomeEmailProps {
  steps: {
    id: number
    description: React.ReactNode
  }[]
  links: {
    title: string
    href: string
  }[]
  userName?: string
}

// const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : "";

const WelcomeEmail = ({
  steps,
  links,
  userName = 'משתמש יקר',
}: WelcomeEmailProps) => {
  return (
    <Html lang="he">
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#4CAF50',
                offwhite: '#fafbfb',
              },
              spacing: {
                0: '0px',
                20: '20px',
                45: '45px',
              },
            },
          },
        }}
      >
        <Preview>ברוך הבא ל-SpareBite</Preview>
        <Body
          className="bg-offwhite font-sans text-base"
          dir="rtl"
        >
          <Img
            src={`https://sparebite.com/_next/image?url=%2Ficon-512x512.png&w=96&q=75`}
            width="160"
            height="auto"
            alt="SpareBite Logo"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              שלום {userName},
            </Heading>
            <Heading className="my-0 text-center leading-8">
              ברוך הבא ל-SpareBite!
            </Heading>

            <Section>
              <Row className="mt-4">
                <Text className="text-base leading-6">
                  כולנו מכירים את זה – נשאר אוכל טוב, ואין מה לעשות איתו. חבל
                  לזרוק, נכון?
                </Text>
                <Text className="text-base leading-6">
                  SpareBite נולד בדיוק מהמקום הזה – ליצור מרחב נעים, פשוט,
                  וקהילתי לשיתוף מזון ומוצרים שאפשר עוד ליהנות מהם.
                </Text>
                <Text className="text-base leading-6">
                  אז ברוך/ה הבא/ה! תרגיש/י חופשי לשתף, לקבל, ולעזור לכולנו לעשות
                  שימוש חכם ומועיל יותר במה שכבר יש.
                </Text>
                <Text className="text-base leading-6">שמח שאת/ה פה 💚</Text>
                <Text className="text-base leading-6 pt-4">
                  בחום,
                  <br /> ידידיה אברג&apos;ל <br />
                  מייסד SpareBite
                </Text>

                {/* <Text className='text-base mt-4'>כך תוכל להתחיל:</Text> */}
              </Row>
            </Section>

            <ul className="mt-4">
              {steps?.map((step) => (
                <li
                  className="mb-4"
                  key={step.id}
                >
                  {step.description}
                </li>
              ))}
            </ul>

            {/* <Section className='text-center mt-6'>
              <Button className='rounded-lg bg-brand px-[18px] py-3 text-white'>
                התחבר למערכת
              </Button>
            </Section> */}

            <Section className="mt-45">
              <Row className="text-center">
                {links?.map((link) => (
                  <Column
                    key={link.title}
                    className="py-2"
                  >
                    <Link
                      className="font-bold text-black underline"
                      href={link.href}
                    >
                      {link.title}
                    </Link>
                    <span className="text-green-600">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            {/* <Section>
              <Row>
                <Column className='px-20 text-right'>
                  <Link href='https://your-domain.com/unsubscribe'>
                    הסר מהרשימה
                  </Link>
                </Column>
                <Column className='text-left'>
                  <Link href='https://your-domain.com/preferences'>
                    ניהול העדפות
                  </Link>
                </Column>
              </Row>
            </Section> */}
            <Text className="mb-45 text-center text-gray-400">
              SpareBite, ירושלים, ישראל | © {new Date().getFullYear()}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  steps: [
    {
      id: 1,
      description: (
        <li
          className="mb-20"
          key={1}
        >
          <strong>פרסם שאריות אוכל טובות.</strong> העלה פריטים שלא תצרוך כדי
          שאחרים יוכלו להיעזר בהם.
        </li>
      ),
    },
    {
      id: 2,
      description: (
        <li
          className="mb-20"
          key={2}
        >
          <strong>מצא אוכל בסביבה שלך.</strong> חפש תרומות מזון באזור שלך וקח
          חלק בפתרון חברתי.
        </li>
      ),
    },
    {
      id: 3,
      description: (
        <li
          className="mb-20"
          key={3}
        >
          <strong>שתף חברים.</strong> ככל שיותר יצטרפו – כך נוכל לעזור ליותר
          אנשים ולמנוע בזבוז מיותר.
        </li>
      ),
    },
  ],
  links: [
    {
      title: 'בקרו באתר שלנו',
      href: 'https://your-domain.com',
    },
    { title: 'קראו עוד על הפרויקט', href: 'https://your-domain.com/about' },
    { title: 'צרו קשר', href: 'https://your-domain.com/contact' },
  ],
} satisfies WelcomeEmailProps

export default WelcomeEmail
