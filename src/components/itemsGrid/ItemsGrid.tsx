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
import { usePathname, useRouter } from "@/i18n/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import StartChatButton from "@/components/startChatButton/StartChatButton";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import FilterAndSearchBar from "../productSearchBar/filterAndSearchBar/FilterAndSearchBar";
import { Clock, Loader, Mail, Smartphone, User2 } from "lucide-react";
import {
  formatDistanceToNow,
  differenceInMinutes,
  differenceInHours,
  format,
  differenceInDays,
} from "date-fns";
import { he } from "date-fns/locale";
import useCurrentUser from "@/hooks/db/useCurrentUser";
import useItems from "@/hooks/db/useItems";
import { useInView } from "react-intersection-observer";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useSearchParams } from "next/navigation";
import { DbFoodItem } from "@/types/item/item";
import { posthog } from "posthog-js";
import { LinkButton } from "../ui/link-button";
import { Separator } from "../ui/separator";

export default function ItemsGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const { filters } = useSearchFilters();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useItems({
    ...filters,
    excludeUserId: currentUser?.id,
    status: ["published"],
    pageSize: 20,
  });
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParamsString]);

  function getPublishedText(date: Date | null) {
    if (!date) {
      return "תאריך לא זמין";
    }
    const createdAt = new Date(date);
    const now = new Date();
    const minutes = differenceInMinutes(now, createdAt);
    const hours = differenceInHours(now, createdAt);
    const days = differenceInDays(now, createdAt);

    if (minutes < 60) {
      return `פורסם לפני ${formatDistanceToNow(createdAt, {
        locale: he,
        addSuffix: false,
      })}`;
    } else if (hours < 24) {
      return `פורסם לפני ${formatDistanceToNow(createdAt, {
        locale: he,
        addSuffix: false,
      })}`;
    } else if (days === 1) {
      return "פורסם אתמול";
    } else if (days < 7) {
      return `פורסם ב־${days} הימים האחרונים`;
    } else {
      return `פורסם ב־${format(createdAt, "d בMMMM yyyy", {
        locale: he,
      })}`;
    }
  }

  return (
    <div>
      <FilterAndSearchBar />
      <div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.pages?.flatMap((page: any) =>
          page?.map((item: DbFoodItem) => (
            <Card
              key={item.id}
              className='rounded-2xl shadow-lg hover:shadow-xl gap-3 transition-shadow p-0 overflow-hidden'
            >
              <CardContent className='p-0 space-y-2 flex flex-col h-full'>
                <div className='rounded-2xl overflow-hidden h-[191.2px] relative'>
                  <Carousel
                    className='w-full m-auto p-0 rounded h-full'
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
                              priority={false}
                              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                              className='object-cover blur-sm scale-110 opacity-70'
                              aria-hidden='true'
                            />
                            <Image
                              src={image}
                              alt={item.title}
                              fill
                              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                              className='object-contain z-10'
                              priority={index === 0}
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
                <div className='flex flex-col gap-3 p-2 justify-end'>
                  <h2
                    className='text-lg font-semibold line-clamp-1'
                    onClick={() => {
                      setOpenItemId(item.id);
                      posthog.capture("item_dialog_viewed", {
                        open_from: "item_title_click",
                        itemId: item.id,
                      });
                    }}
                    role='button'
                    tabIndex={0}
                    aria-pressed={openItemId === item.id}
                  >
                    {item.title}
                  </h2>
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {item.description}
                  </p>
                  <p className='text-xs text-right text-muted-foreground'>
                    <Badge
                      className='text-xs flex gap-2 items-center'
                      variant='secondary'
                    >
                      <Clock className='w-4 h-4' />
                      <span className='sm:inline'>
                        {getPublishedText(item.published_at)}
                      </span>
                    </Badge>
                  </p>
                  <div className='self-end h-10 w-full items-end flex'>
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
                          onClick={() => {
                            setOpenItemId(item.id);
                            posthog.capture("item_dialog_viewed", {
                              open_from: "view_details_button_click",
                              itemId: item.id,
                            });
                          }}
                          disabled={openItemId === item.id}
                        >
                          הצג פרטים
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='h-120 overflow-y-auto max-w-3xl'>
                        <DialogHeader className='m-auto text-center space-y-2'>
                          <DialogTitle className='text-center'>
                            {item.title}
                          </DialogTitle>
                          <DialogDescription className='text-xs flex flex-row gap-2 items-center text-muted-foreground'>
                            <Clock className='w-3 h-3' />
                            {getPublishedText(item.published_at)}
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
                                      alt={`${item.title} blurred background`}
                                      fill
                                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                                      className='object-cover blur-sm scale-110 opacity-70'
                                      aria-hidden='true'
                                      loading='lazy'
                                    />
                                    <Image
                                      src={image}
                                      alt={`${item.title} image ${index + 1}`}
                                      fill
                                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                                      priority={index === 0}
                                      className='object-contain z-10'
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
                          <div className='flex flex-col gap-2'>
                            <h2 className='text-md text-muted-foreground'>
                              תיאור
                            </h2>
                            <p className='text-base'>{item.description}</p>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <h2 className='text-md text-muted-foreground'>
                              כתובת איסוף
                            </h2>
                            <Separator />
                            {currentUser ? (
                              <div className='flex gap-2 text-base'>
                                <p>
                                  {item.street_name},
                                  {/* {item.street_number} */}
                                </p>
                                <p>{item.city},</p>
                                <p>{item.country}</p>
                              </div>
                            ) : (
                              <Button
                                variant='outline'
                                className='w-full mt-2'
                                onClick={() =>
                                  router.push(
                                    `/auth/login?redirect=${encodeURIComponent(pathname)}`
                                  )
                                }
                              >
                                עליך להתחבר כדי לראות את הכתובת
                              </Button>
                            )}
                          </div>
                          <div className='flex flex-col gap-2'>
                            <h2 className='text-md text-muted-foreground'>
                              פרטי קשר
                            </h2>
                            <Separator />
                            {currentUser ? (
                              <div className='space-y-3'>
                                <p className='text-base py-1 flex items-center gap-2'>
                                  <User2 className='w-5 h-5 text-muted-foreground' />
                                  {item.full_name}
                                </p>
                                <div className='grid grid-cols-1 gap-2 text-base'>
                                  <LinkButton
                                    href={`https://mail.google.com/mail/?view=cm&to=${item.email}&su=${encodeURIComponent("פנייה מהאתר SpareBite")}&body=${encodeURIComponent(`לגבי הפריט ${item.title}`)}`}
                                    target='_blank'
                                    className='flex items-center gap-2 w-full'
                                  >
                                    <Mail />
                                    שלח דוא&quot;ל
                                  </LinkButton>
                                  {item.phone_number && (
                                    <div className='flex align-center gap-2 w-full'>
                                      <LinkButton
                                        href={`tel:${item.phone_number}`}
                                        className='flex items-center gap-2 flex-1'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                      >
                                        <Smartphone />
                                        <span>התקשר</span>
                                      </LinkButton>
                                      {item.is_have_whatsapp && (
                                        <Tooltip>
                                          <LinkButton
                                            href={`https://wa.me/${item.phone_number.replace(
                                              /[^0-9]/g,
                                              ""
                                            )}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex-1'
                                          >
                                            <FaWhatsapp size={20} />
                                            <span>שלח הודעת וואטסאפ</span>
                                          </LinkButton>
                                        </Tooltip>
                                      )}
                                    </div>
                                  )}
                                  <StartChatButton
                                    targetUserId={item.user_id}
                                    itemId={item.id}
                                  />
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant='outline'
                                className='w-full mt-2'
                                onClick={() =>
                                  router.push(
                                    `/auth/login?redirect=${encodeURIComponent(pathname)}`
                                  )
                                }
                              >
                                עליך להתחבר כדי לראות את פרטי הקשר
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {hasNextPage && (
          <div ref={ref} className='text-center text-muted-foreground py-4'>
            <Loader className='animate-spin' size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
