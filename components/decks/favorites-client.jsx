"use client";
import { motion } from "framer-motion";
import { CalendarDays, BookOpen, User, Heart } from "lucide-react";
import { getTimeIndicator } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { removeFromFavorites } from "@/app/actions/deck";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const container = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function FavoritesClient({ decks, userId }) {
  const [loading, setLoading] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleRemove = async (e, deckId, deckName) => {
    e.preventDefault();
    e.stopPropagation();
    if(loading === deckId) {
      return;
    }
    setLoading(deckId);
    const { success, error } = await removeFromFavorites({ deckId, userId });
    if(success) {
      toast({
        title: "Success",
        description: `Removed '${deckName}' from favorites`,
        duration: 2500,
      });
      router.refresh();
    }
    else {
      toast({
        title: "Error",
        description: error?.message || error || "Failed to remove deck from favorites",
        variant: "destructive",
        duration: 2500,
      });
    }
    setLoading(null);
  }

  return (
    <div className="min-h-[calc(100vh-48px)] max-w-7xl mx-auto py-8 px-7">
      <header className="mb-8 md:px-8 px-5">
        <h1 className="text-4xl font-bold mb-2 [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
          My Favorites
        </h1>
        <p className="text-muted-foreground">
          {decks.length} deck{decks.length !== 1 && 's'} in your collection
        </p>
      </header>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {decks.map((deck) => (
          <motion.div
            key={deck.id}
            variants={item}
            onMouseEnter={() => router.prefetch(`/decks/${deck.id}`)}
            onMouseDown={(e) => {
              if(loading === deck.id) {
                return;
              }
              e.preventDefault();
              router.push(`/decks/${deck.id}`);
            }}
          >
            <div className="group cursor-pointer relative rounded-lg border bg-card p-6 transition-all duration-200 shadow-[0_2px_6px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.28)] hover:scale-[1.02] dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.24)]">
              <Button
                variant="ghost"
                size="icon"
                onMouseDown={(e) => handleRemove(e, deck.id, deck.name)}
                className={`absolute right-[20px] h-[35px] w-[35px] rounded top-6 z-50 animate-bounce ease-linear [animation-duration:_1.5s] hover:bg-[none] bg-[none] hover:text-[none] ${Loading === deck.id ? "text-gray-300 dark:text-gray-600" : "text-red-400"}`}
                disabled={loading === deck.id}
              >
                <Heart className="h-[35px] w-[35px] p-[6px] hover:fill-current" />
              </Button>
              <div className="mb-4 pr-9">
                <h3 className="text-xl font-semibold truncate [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
                  {deck.name}
                </h3>
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}