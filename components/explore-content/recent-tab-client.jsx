"use client";
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Settings2, Sparkle, Loader, CircleUser } from 'lucide-react';
import FavoritesButton from '../favorites-button';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const item = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function RecentTabClient({ decks, userId }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    {decks.map((deck) => (
      <motion.div key={deck.id} variants={item}>
        <Card className="relative group transition-all duration-200 shadow-lg hover:shadow-[0_8px_36px_rgba(0,0,0,0.24)] hover:scale-[1.02] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.19)]">
          {(userId === deck.creator_id) ? (
            <Link href={`/decks/${deck.id}/edit`} className="absolute top-[10px] lg:top-[14px] right-[20px] transition hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full p-2">
              <Settings2 className="h-6 lg:h-4 w-6 lg:w-4" />
            </Link>
            ) : (
            <FavoritesButton deckId={deck.id} is_favorite={deck.is_favorite} size="6" userId={userId} className="absolute top-[10px] lg:top-[14px] right-[20px] transition hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full p-2" />
            )
          }
          <Link href={`/decks/${deck.id}`}>
            <div className="p-6 xl:pt-5">
              <div className="mb-2 xl:mb-3 pr-9" title={deck.name}>
                <h3 className="text-xl font-semibold truncate">{deck.name}</h3>
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
                  <div className="flex items-center gap-[6px]">
                    {deck.count_ratings > 0 ? (
                      <>
                        <span>{(1.0 * deck.total_rating / deck.count_ratings).toFixed(1)}</span>
                        <Sparkle />
                      </>
                    ) : (
                      <>
                        <Loader />
                        <span className="font-medium">None</span>
                      </>
                    )}
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
            </div>
          </Link>
        </Card>
      </motion.div>
    ))}
    </motion.div>
  );
}