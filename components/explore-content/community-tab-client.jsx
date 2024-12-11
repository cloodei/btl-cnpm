"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Settings2, CircleUser, ArrowLeftFromLine, StarOff } from 'lucide-react';
import { Button } from '../ui/button';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};
  
const generateRating = () => {
  return (
    <>
      <StarOff className="h-5 w-5" />
      <span className="font-medium">None</span>
    </>
  );
}

export default function CommunityTabClient({ decks, userId }) {
  const [paginatedDecks, setPaginatedDecks] = useState(decks.slice(0, 8));

  const handleLoadMore = () => {
    const nextDecks = decks.slice(0, paginatedDecks.length + 8);
    setPaginatedDecks(nextDecks);
  };

  return (
  <div className="pt-4 sm:pt-8 sm:relative">
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5">
    {paginatedDecks.map((deck) => (
      <motion.div key={deck.id} variants={item}>
        <Card className="relative group transition-all [transition-duration:_250ms] [animation-duration:_250ms] dark:border-[#272a31] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:scale-[1.03]">
          {(userId === deck.creator_id) ? (
            <Link href={`/decks/${deck.id}/edit`} className="absolute top-[10px] lg:top-[14px] right-[20px] transition hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full p-2">
              <Settings2 className="h-6 lg:h-4 w-6 lg:w-4" />
            </Link>
          ) : null}
          <div className="p-6 pb-4 xl:pt-5">
            <div className="mb-2 xl:mb-3 pr-9" title={deck.name}>
              <h3 className="text-2xl font-bold truncate dark:[text-shadow:_0_2px_5px_rgb(145_164_203_/_0.85)]">
                {deck.name}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cards</span>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {deck.totalcards}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ratings</span>
                <div className="flex items-center gap-2">
                  {generateRating(deck.avg_rating)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Created By</span>
                {deck.creator_id === userId ? (
                  <span className="text-base font-semibold flex items-center">
                    <CircleUser className="h-5 w-5 md:mr-[6px] mr-1" />
                    You
                  </span>
                ) : (
                  <span className="text-base font-semibold">{deck.username}</span>
                )}
              </div>
            </div>
            <Link href={`/decks/${deck.id}`}>
              <Button variant="expandIcon" Icon={ArrowLeftFromLine} iconPlacement='left' className="w-full mt-4 sm:h-8 h-[37px] transition dark:bg-[#d0d1d1] dark:hover:bg-[#d0d1d1]/70 bg-[#323a41] hover:bg-[#323a41]/80">
                View Deck
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    ))}
    </motion.div>

    {(paginatedDecks.length < decks.length) ? (
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" className="w-full md:w-auto shadow-[0_1px_3px_rgba(0,0,0,0.25)] dark:border-[#34393f]" onClick={handleLoadMore}>
          Load More
        </Button>
      </div>
    ) : null}
  </div>
  );
}