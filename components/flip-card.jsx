"use client";
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function CardFlip({ front, back, className = "", ...props }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn("w-full h-full cursor-pointer perspective-1000", className)}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
      {...props}
    >
      <div
        className="relative transition-all [transition-duration:_550ms] w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : undefined
        }}
      >
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
          <div className="h-full cursor-pointer rounded-xl p-8 bg-card border dark:border-[#2d2e3a] shadow-[0_2px_9px_rgba(0,0,0,0.26)]" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="flex flex-col justify-center items-center h-full">

              <p className="md:text-3xl text-2xl font-semibold text-center select-none">
                {front}
              </p>

              <p className="text-sm text-muted-foreground mt-4 select-none">
                Click to flip
              </p>

            </div>
          </div>
        </div>

        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="h-full cursor-pointer rounded-xl p-8 bg-card border dark:border-[#303242] shadow-[0_2px_9px_rgba(0,0,0,0.26)]" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="flex flex-col justify-center items-center h-full">

              <p className="md:text-3xl text-2xl font-semibold text-center select-none">
                {back}
              </p>

              <p className="text-sm text-muted-foreground mt-4 select-none">
                Click to flip back
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};