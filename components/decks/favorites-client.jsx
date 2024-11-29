"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, BookOpen, User, Heart } from "lucide-react";
import { getTimeIndicator } from "@/lib/utils";

const animations = {
  container: {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }
};

export default function FavoritesClient({ decks }) {
  return (
    <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-background to-muted/20 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:px-8 px-5">
          <h1 className="text-4xl font-bold mb-2 [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {decks.length} deck{decks.length !== 1 ? 's' : ''} in your collection
          </p>
        </header>
        <motion.div 
          variants={animations.container}
          initial="hidden"
          animate="show"
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {decks.map((deck) => (
            <motion.div key={deck.id} variants={animations.item}>
              <Link href={`/decks/${deck.id}`}>
                <div className="group relative rounded-lg border bg-card p-6 transition-all duration-200 shadow-[0_3px_12px_rgba(0,0,0,0.23)] hover:shadow-[0_8px_36px_rgba(0,0,0,0.28)] hover:scale-[1.02] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.19)]">
                  <div className="absolute md:right-6 right-4 md:top-6 top-4">
                    <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                  </div>
                  <div className="mb-4 pr-8">
                    <h3 className="text-xl font-semibold truncate">{deck.name}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      <span>{deck.username}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>{deck.totalcards} cards</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>Added {getTimeIndicator(deck.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}