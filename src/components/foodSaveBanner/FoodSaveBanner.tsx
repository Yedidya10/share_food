// components/FoodStatsBanner.tsx
"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export interface StatItem {
  label: string;
  number: string;
  unit: string;
  lightColor: string;
  darkColor: string;
}

interface FoodStatsBannerProps {
  stats: StatItem[];
}

export function FoodStatsBanner({ stats }: FoodStatsBannerProps) {
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    const storedClosed = localStorage.getItem("foodStatsBannerClosed");

    if (storedClosed === "true") {
      setClosed(true);
    } else {
      setClosed(false);
    }
  }, []);

  const handleClose = () => {
    setClosed(true);
    localStorage.setItem("foodStatsBannerClosed", "true");
  };

  return (
    <Card
      className={`p-6 sm:p-12 rounded-2xl shadow-lg bg-white dark:bg-gray-900 overflow-hidden relative ${closed ? "hidden" : "block"}`}
    >
      <Button
        variant='outline'
        size={"icon"}
        // This button will close the banner
        className='absolute top-4 left-4 z-10'
        onClick={() => handleClose()}
        aria-label='סגירת סטטיסטיקות אובדן מזון'
      >
        <X />
      </Button>
      <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-18 sm:gap-x-12 lg:gap-x-16 xl:gap-x-26 2xl:gap-x-32 gap-y-6 sm:gap-y-10 auto-rows-min'>
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 120 }}
            className='flex items-center text-center'
          >
            <div className='flex flex-col items-center text-center min-w-0 w-full'>
              <span className='font-sans text-xs sm:text-md mt-2 tracking-wide uppercase text-gray-600 dark:text-gray-400 break-words'>
                {stat.label}
              </span>
              <div className='flex flex-wrap flex-col items-baseline justify-center gap-1 sm:gap-2 mt-1'>
                <p
                  className={cn(
                    "font-serif font-extrabold text-3xl xs:text-4xl sm:text-7xl break-words",
                    `${stat.lightColor} dark:${stat.darkColor}`
                  )}
                >
                  {stat.number}
                </p>
                <p
                  className={cn(
                    "font-sans font-medium text-sm xs:text-base sm:text-3xl break-words line-clamp-1",
                    `${stat.lightColor} dark:${stat.darkColor}`
                  )}
                >
                  {stat.unit}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
