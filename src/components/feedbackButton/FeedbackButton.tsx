// FeedbackButton.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas-pro"; // שים לב! html2canvas-pro
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, Trash } from "lucide-react";
import { motion } from "framer-motion";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [rects, setRects] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const takeScreenshot = async () => {
    const canvas = await html2canvas(document.body, {
      ignoreElements: (el) => el.classList.contains("feedback-overlay"),
    });
    setScreenshot(canvas.toDataURL("image/png"));
    setRects([]);
  };

  const redrawRects = (
    ctx: CanvasRenderingContext2D,
    rects: { x1: number; y1: number; x2: number; y2: number }[]
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    const scaleX = ctx.canvas.width / ctx.canvas.getBoundingClientRect().width;
    const scaleY =
      ctx.canvas.height / ctx.canvas.getBoundingClientRect().height;
    rects.forEach(({ x1, y1, x2, y2 }) => {
      const xStart = x1 * scaleX;
      const yStart = y1 * scaleY;
      const xEnd = x2 * scaleX;
      const yEnd = y2 * scaleY;
      const x = Math.min(xStart, xEnd);
      const y = Math.min(yStart, yEnd);
      const w = Math.abs(xStart - xEnd);
      const h = Math.abs(yStart - yEnd);
      ctx.strokeRect(x, y, w, h);
    });
  };

  const saveAnnotatedImage = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const img = new Image();
    img.src = screenshot!;
    img.onload = () => {
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d")!;
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      ctx.drawImage(canvasRef.current!, 0, 0);

      const finalDataUrl = tempCanvas.toDataURL("image/png");
      console.log("📤 Final image ready:", finalDataUrl);

      setOpen(false);
      setScreenshot(null);
      setRects([]);
    };
  };

  const clearScreenshot = () => {
    setScreenshot(null);
    setRects([]);
  };

  const clearRects = () => {
    setRects([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDrawing.current = true;
      const rect = canvas.getBoundingClientRect();
      start.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      const rect = canvas.getBoundingClientRect();
      const x2 = e.clientX - rect.left;
      const y2 = e.clientY - rect.top;
      isDrawing.current = false;
      setRects((prev) => [
        ...prev,
        { x1: start.current.x, y1: start.current.y, x2, y2 },
      ]);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      redrawRects(ctx, [
        ...rects,
        { x1: start.current.x, y1: start.current.y, x2: x, y2: y },
      ]);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    redrawRects(ctx, rects);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [screenshot, rects]);

  return (
    <>
      <motion.div
        className='fixed bottom-2 left-8 z-50 feedback-overlay'
        initial={{ x: -80, opacity: 0.8 }}
        whileHover={{ x: -20, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Button
          onClick={() => setOpen(true)}
          className='rounded-full shadow-lg px-4 py-2'
        >
          <Lightbulb />
          <span className='hidden sm:inline'>משוב</span>
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='feedback-overlay max-w-2xl'>
          <DialogHeader>
            <DialogTitle>יש לך הצעה או נתקלת בבאג?</DialogTitle>
          </DialogHeader>

          <div className='space-y-3 mt-2'>
            <textarea
              placeholder='פרט כאן את הבאג או ההצעה שלך...'
              className='w-full border rounded-md p-2 min-h-[100px]'
            />

            {!screenshot && (
              <Button variant='secondary' onClick={takeScreenshot}>
                📸 צלם מסך והוסף סימון
              </Button>
            )}

            {screenshot && (
              <div className='relative border rounded-md overflow-hidden'>
                <img
                  ref={imgRef}
                  src={screenshot}
                  alt='screenshot'
                  className='w-full block'
                />
                <canvas
                  ref={canvasRef}
                  className='absolute inset-0 w-full h-full cursor-crosshair'
                />
              </div>
            )}

            {screenshot && (
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='ghost'
                  onClick={clearScreenshot}
                  className='text-red-500'
                >
                  <Trash className='w-4 h-4 mr-1' /> מחק צילום
                </Button>
                <Button variant='ghost' onClick={clearRects}>
                  🧽 הסר סימונים
                </Button>
              </div>
            )}

            <div className='flex gap-2 mt-4'>
              {screenshot && (
                <Button onClick={saveAnnotatedImage}>שליחה עם צילום</Button>
              )}
              {!screenshot && (
                <Button onClick={() => setOpen(false)}>שליחה בלי צילום</Button>
              )}
              <Button
                variant='destructive'
                onClick={() => {
                  setOpen(false);
                  setScreenshot(null);
                }}
              >
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
