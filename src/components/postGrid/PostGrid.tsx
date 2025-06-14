"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import StartChatButton from "@/components/startChatButton/StartChatButton";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ItemsSkeleton from "@/components/skeletons/itemsSkeleton/ItemsSkeleton";
import { render } from "@react-email/render";
import WelcomeEmail from "@/components/emailTemplates/welcomeEmail/WelcomeEmail";

type Item = {
  user_id: string;
  id: string;
  title: string;
  description: string;
  images: string[];
  full_name: string;
  street_name: string;
  street_number: string;
  city: string;
  postal_code?: string;
  country: string;
  phone_number?: string;
  is_have_whatsapp?: boolean;
  email?: string;
  status: "pending" | "published" | "draft";
  created_at: string;
};

export default function PostGrid({ items }: { items: Item[] }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingUserId, setIsLoadingUserId] = useState(true);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      setIsLoadingUserId(false);
    });

    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          const user = session?.user;
          setUserId(user?.id || null);

          if (user?.created_at === user?.updated_at) {
            supabase.from("profiles").upsert(
              {
                id: user?.id,
                email: user?.email,
                full_name: user?.user_metadata?.full_name || "",
                first_name: user?.user_metadata?.full_name?.split(" ")[0] || "",
                last_name: user?.user_metadata?.full_name?.split(" ")[1] || "",
                phone: user?.phone || "",
                avatar_url: user?.user_metadata?.avatar_url || "",
                created_at: session?.user.created_at,
                updated_at: session?.user.updated_at,
              },
              { onConflict: "id" }
            );

            async function sendWelcomeEmail() {
              try {
                const html = await render(
                  <WelcomeEmail
                    userName={
                      user?.user_metadata?.full_name.split(" ")[0] || ""
                    }
                    steps={[
                      {
                        id: 1,
                        Description: (
                          <>
                            <p>
                              ברוך הבא ל-Share Food – יחד מצמצמים את בזבוז המזון
                            </p>
                            <p>
                              אנו שמחים שהצטרפת אלינו! Share Food הוא פרויקט
                              קהילתי שנועד לעזור לך למצוא מזון עודף ולשתף אותו
                              עם אחרים.
                            </p>
                          </>
                        ),
                      },
                      {
                        id: 2,
                        Description: (
                          <>
                            <p>
                              כדי להתחיל, פשוט לחץ על כפתור &quot;פרסם
                              פריט&quot; למעלה והתחל לשתף את המזון העודף שלך עם
                              הקהילה.
                            </p>
                          </>
                        ),
                      },
                    ]}
                    links={[
                      {
                        href: "https://sharefood.org.il",
                        title: "בקר באתר Share Food",
                      },
                      {
                        href: "https://sharefood.org.il/terms",
                        title: "תנאי השימוש",
                      },
                    ]}
                  />
                );

                fetch("/api/send-welcome-oauth", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: user?.email,
                    html,
                  }),
                });
              } catch (error) {
                console.error(error);
              }
            }

            sendWelcomeEmail();
          }
        }

        if (event === "SIGNED_OUT") {
          setUserId(null);
        }
      }
    );

    return () => {
      authData?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoadingUserId) {
    return <ItemsSkeleton />;
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
      {items.map(
        (item) =>
          item.user_id !== userId &&
          item.status === "published" && (
            <Card
              key={item.id}
              className='rounded-2xl shadow-lg hover:shadow-xl gap-3 transition-shadow p-0 overflow-hidden'
            >
              <div className='rounded-2xl overflow-hidden'>
                <Carousel
                  className='w-full m-auto p-0 rounded'
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {Array.from(item.images).map((image, index) => (
                      <CarouselItem key={index}>
                        <div className='relative h-48 overflow-hidden border-b'>
                          <Image
                            src={image}
                            alt={`${item.title} blurred background`}
                            fill
                            className='object-cover blur-sm scale-110 opacity-70'
                            aria-hidden='true'
                          />
                          <Image
                            src={image}
                            alt={item.title}
                            fill
                            className='object-contain z-10'
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    variant='outline'
                    className='absolute left-2'
                  />
                  <CarouselNext
                    variant='outline'
                    className='absolute right-2'
                  />
                </Carousel>
              </div>
              <CardContent className='p-2 space-y-2'>
                <h3
                  className='text-xl font-semibold'
                  onClick={() => setOpenItemId(item.id)}
                >
                  {item.title}
                </h3>
                <p className='text-sm text-muted-foreground line-clamp-3'>
                  {item.description}
                </p>
                <p className='text-xs text-right text-muted-foreground'>
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                <Dialog
                  open={openItemId === item.id}
                  onOpenChange={(open) => {
                    setOpenItemId(open ? item.id : null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full mt-2'
                      onClick={() => setOpenItemId(item.id)}
                      disabled={openItemId === item.id}
                    >
                      הצג פרטים
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='h-120 overflow-y-auto max-w-3xl'>
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        פורסם בתאריך{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-6'>
                      <Carousel className='w-full' opts={{ loop: true }}>
                        <CarouselContent>
                          {item.images.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className='relative h-64 rounded overflow-hidden'>
                                <Image
                                  src={image}
                                  alt={`${item.title} image ${index + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious
                          variant='outline'
                          className='absolute left-2 top-1/2 -translate-y-1/2'
                        />
                        <CarouselNext
                          variant='outline'
                          className='absolute right-2 top-1/2 -translate-y-1/2'
                        />
                      </Carousel>
                      <div>
                        <h4 className='text-lg font-semibold mb-1'>תיאור:</h4>
                        <p className='text-base text-muted-foreground'>
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <h4 className='text-lg font-semibold mb-1'>
                          כתובת איסוף:
                        </h4>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-base'>
                          <p>{`${item.street_name} ${item.street_number}`}</p>
                          <p>{item.city}</p>
                          <p>{item.country}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className='text-lg font-semibold mb-1'>
                          פרטי קשר:
                        </h4>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                          <p className='text-base'>{item.full_name}</p>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-1 gap-2 text-base'>
                          <StartChatButton targetUserId={item.user_id} />
                          <p>{item.email}</p>
                          {item.phone_number && (
                            <div className='flex align-center gap-2'>
                              <p>טלפון: </p>
                              <p>{item.phone_number}</p>
                              {item.is_have_whatsapp && (
                                <Tooltip>
                                  <Link
                                    href={`https://wa.me/${item.phone_number.replace(
                                      /[^0-9]/g,
                                      ""
                                    )}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center text-green-500 hover:text-green-700'
                                  >
                                    <FaWhatsapp size={20} />
                                  </Link>
                                </Tooltip>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )
      )}
    </div>
  );
}
