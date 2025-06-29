'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Lightbulb, Trash } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { submitFeedbackReport } from '@/lib/supabase/actions/submitFeedback'

type Rect = {
  x1: number
  y1: number
  x2: number
  y2: number
  type: 'highlight' | 'blackout'
}

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [rects, setRects] = useState<Rect[]>([])
  const [mode, setMode] = useState<'highlight' | 'blackout'>('highlight')
  const [description, setDescription] = useState('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const isDrawing = useRef(false)
  const start = useRef({ x: 0, y: 0 })

  const captureScreen = async () => {
    setOpen(false)
    await new Promise((res) => setTimeout(res, 10000)) // זמן המתנה שהדיאלוג ייעלם

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true,
      })

      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')

      stream.getTracks().forEach((track) => track.stop())

      setScreenshot(dataUrl)
      setRects([])
      setTimeout(() => setOpen(true), 100)
    } catch (err) {
      console.error('שגיאה בצילום המסך:', err)
      setOpen(true)
    }
  }

  const clearScreenshot = () => {
    setScreenshot(null)
    setRects([])
  }

  const clearRects = () => {
    setRects([])
    canvasRef.current
      ?.getContext('2d')
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const saveAnnotatedImage = async () => {
    if (!imgRef.current || !canvasRef.current || !screenshot) return

    const img = new window.Image()
    img.onload = async () => {
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')!
      tempCanvas.width = img.width
      tempCanvas.height = img.height

      ctx.drawImage(img, 0, 0)

      const scaleX = img.width / canvasRef.current!.clientWidth
      const scaleY = img.height / canvasRef.current!.clientHeight

      rects.forEach(({ x1, y1, x2, y2, type }) => {
        const x = Math.min(x1, x2) * scaleX
        const y = Math.min(y1, y2) * scaleY
        const w = Math.abs(x1 - x2) * scaleX
        const h = Math.abs(y1 - y2) * scaleY

        if (type === 'highlight') {
          ctx.strokeStyle = 'red'
          ctx.lineWidth = 4
          ctx.strokeRect(x, y, w, h)
        } else {
          ctx.fillStyle = 'black'
          ctx.fillRect(x, y, w, h)
        }
      })

      const finalDataUrl = tempCanvas.toDataURL('image/png')

      await submitFeedbackReport({
        description,
        imageDataUrl: finalDataUrl,
      })

      setOpen(false)
      setScreenshot(null)
      setRects([])
      setDescription('')
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const handleMouseDown = (e: MouseEvent) => {
      isDrawing.current = true
      const rect = canvas.getBoundingClientRect()
      start.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing.current) return
      const rect = canvas.getBoundingClientRect()
      const x2 = e.clientX - rect.left
      const y2 = e.clientY - rect.top
      isDrawing.current = false
      setRects((prev) => [
        ...prev,
        { x1: start.current.x, y1: start.current.y, x2, y2, type: mode },
      ])
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      rects
        .concat({
          x1: start.current.x,
          y1: start.current.y,
          x2: x,
          y2: y,
          type: mode,
        })
        .forEach(({ x1, y1, x2, y2, type }) => {
          const x = Math.min(x1, x2)
          const y = Math.min(y1, y2)
          const w = Math.abs(x1 - x2)
          const h = Math.abs(y1 - y2)

          if (type === 'highlight') {
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, w, h)
          } else {
            ctx.fillStyle = 'black'
            ctx.fillRect(x, y, w, h)
          }
        })
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [screenshot, rects, mode])

  return (
    <>
      <motion.div
        className="fixed bottom-2 left-8 z-50 feedback-overlay"
        initial={{ x: -80, opacity: 0.8 }}
        whileHover={{ x: -20, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full shadow-lg px-4 py-2"
        >
          <Lightbulb />
          <span className="hidden sm:inline">משוב</span>
        </Button>
      </motion.div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="feedback-overlay max-w-2xl">
          <DialogHeader>
            <DialogTitle>יש לך הצעה או נתקלת בבאג?</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <textarea
              placeholder="פרט כאן את הבאג או ההצעה שלך..."
              className="w-full border rounded-md p-2 min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {!screenshot && (
              <Button
                variant="secondary"
                onClick={captureScreen}
              >
                📸 צילום מסך אמיתי
              </Button>
            )}

            {screenshot && (
              <div className="relative border rounded-md overflow-hidden">
                <Image
                  ref={imgRef}
                  src={screenshot}
                  alt="screenshot"
                  width={1280}
                  height={720}
                  unoptimized
                  className="w-full block"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                />
              </div>
            )}

            {screenshot && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={clearScreenshot}
                  className="text-red-500"
                >
                  <Trash className="w-4 h-4 mr-1" /> מחק צילום
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearRects}
                >
                  🧽 הסר סימונים
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setMode((m) =>
                      m === 'highlight' ? 'blackout' : 'highlight',
                    )
                  }
                >
                  🖊️ {mode === 'highlight' ? 'עבור להשחרה' : 'עבור לסימון'}
                </Button>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {screenshot && (
                <Button onClick={saveAnnotatedImage}>שליחה עם צילום</Button>
              )}
              {!screenshot && (
                <Button onClick={() => submitFeedbackReport({ description })}>
                  שליחה בלי צילום
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
