'use client'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useState } from 'react'
import { AspectRatio } from '../ui/aspect-ratio'

interface HoverImageCarouselProps {
  images: string[]
  title?: string
}

export default function HoverImageCarousel({
  images,
  title = 'תמונה',
}: HoverImageCarouselProps) {
  const firstImage = images?.[0] || '/placeholder.png'
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [open, setOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <Image
        src="/placeholder.png"
        alt="תמונה חסרה"
        width={32}
        height={32}
        className="rounded-full"
      />
    )
  }

  if (isMobile) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Image
            src={firstImage}
            alt={title}
            width={32}
            height={32}
            className="rounded-full cursor-zoom-in"
            onClick={() => setOpen(true)}
          />
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <Carousel>
            <CarouselContent>
              {images.map((img, i) => (
                <CarouselItem key={i}>
                  <Image
                    src={img}
                    alt={`תמונה ${i + 1}`}
                    width={500}
                    height={300}
                    className="rounded-md object-cover mx-auto"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <HoverCard
      openDelay={150}
      closeDelay={200}
    >
      <HoverCardTrigger asChild>
        <Image
          src={firstImage}
          alt={title}
          width={32}
          height={32}
          className="rounded-md object-cover cursor-pointer w-[32px] h-[32px] max-w-[32px] max-h-[32px] "
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-[240px] max-w-[240px] p-0">
        <Carousel>
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i}>
                <AspectRatio
                  ratio={16 / 9}
                  className="w-[280px] max-w-[280px] flex items-center justify-center"
                >
                  <Image
                    src={img}
                    alt={`תמונה ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-contain"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </HoverCardContent>
    </HoverCard>
  )
}
