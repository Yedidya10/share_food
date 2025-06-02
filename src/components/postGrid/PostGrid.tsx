"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
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
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

type Post = {
  id: string;
  title: string;
  description: string;
  images: string[];
  street_name?: string;
  street_number?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone_number?: string;
  is_have_whatsapp?: boolean;
  email?: string;
  created_at: string;
};

export default function PostGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch posts", error);
      } else {
        setPosts(data as Post[]);
      }

      setLoading(false);
    }

    fetchPosts();
  }, [supabase]);

  if (loading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className='h-64 w-full rounded-2xl' />
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 p-4'>
      {posts.map((post) => (
        <Card
          key={post.id}
          className='rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-0 overflow-hidden'
        >
          <div className='rounded-2xl overflow-hidden'>
            <Carousel
              className='w-full max-w-xs m-auto p-0 rounded'
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {Array.from(post.images).map((image, index) => (
                  <CarouselItem key={index}>
                    <div className='relative h-48 overflow-hidden border-b'>
                      <Image
                        src={image}
                        alt={`${post.title} blurred background`}
                        fill
                        className='object-cover blur-sm scale-110 opacity-70'
                        aria-hidden='true'
                      />
                      <Image
                        src={image}
                        alt={post.title}
                        fill
                        className='object-contain z-10'
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant='outline' className='absolute left-2' />
              <CarouselNext variant='outline' className='absolute right-2' />
            </Carousel>
          </div>
          <CardContent className='p-4 space-y-2'>
            <h3 className='text-xl font-semibold'>{post.title}</h3>
            <p className='text-sm text-muted-foreground line-clamp-3'>
              {post.description}
            </p>
            <p className='text-xs text-right text-muted-foreground'>
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full mt-2'
                  onClick={() => {
                    const dialog = document.querySelector(
                      `#dialog-${post.id}`
                    ) as HTMLDialogElement;
                    dialog?.showModal();
                  }}
                >
                  הצג פרטים
                </Button>
              </DialogTrigger>
              <DialogContent className='h-120 overflow-y-auto max-w-3xl'>
                <DialogHeader>
                  <DialogTitle>{post.title}</DialogTitle>
                  <DialogDescription>
                    פורסם בתאריך{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-6'>
                  <Carousel className='w-full' opts={{ loop: true }}>
                    <CarouselContent>
                      {post.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className='relative h-64 rounded overflow-hidden'>
                            <Image
                              src={image}
                              alt={`${post.title} image ${index + 1}`}
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
                      {post.description}
                    </p>
                  </div>
                  <div>
                    <h4 className='text-lg font-semibold mb-1'>כתובת איסוף:</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-base'>
                      <p>{`${post.street_name} ${post.street_number}`}</p>
                      <p>{post.city}</p>
                      <p>{post.country}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className='text-lg font-semibold mb-1'>פרטי קשר:</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-1 gap-2 text-base'>
                      <p>
                        {post.email
                          ? `אימייל: ${post.email}`
                          : "לא צוינה אימייל"}
                      </p>
                      {post.phone_number && (
                        <div className='flex align-center gap-2'>
                          <p>טלפון: </p>
                          <p>{post.phone_number}</p>
                          {post.is_have_whatsapp && (
                            <Tooltip>
                              <Link
                                href={`https://wa.me/${post.phone_number.replace(
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
      ))}
    </div>
  );
}
