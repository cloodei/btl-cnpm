"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatInput } from "@/components/ui/float-input";
import { getTimeIndicator } from "@/lib/utils";
import { removeFromFavorites } from "@/app/actions/deck";
import { CalendarDays, BookOpen, User, Heart, SearchX } from "lucide-react";

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
  const [filteredDecks, setFilteredDecks] = useState(decks);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputBlur = (value) => {
    const val = value.trim().toLowerCase();
    if(val) {
      setFilteredDecks(decks.filter((deck) => deck.name.toLowerCase().includes(val)));
      return;
    }
    setFilteredDecks(decks);
  }

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
      setLoading(null);
      router.refresh();
    }
    else {
      toast({
        title: "Error",
        description: error?.message || error || "Failed to remove deck from favorites",
        variant: "destructive",
        duration: 2500,
      });
      setLoading(null);
    }
  }

  return (
    <div className="min-h-[calc(100vh-48px)] max-w-7xl mx-auto py-8 px-7">
      <header className="sm:flex sm:items-center sm:justify-between sm:gap-2 sm:mb-6 mb-4 px-5">
        <div className="mb-4">
          <h1 className="lg:text-4xl text-[28px] font-bold mb-[3px] sm:mb-2 [text-shadow:_0_1px_4px_rgb(18,18,24,0.22)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
            My Favorites
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {decks.length} deck{decks.length !== 1 && 's'} in your collection
          </p>
        </div>

        <motion.div initial={item.hidden} animate={item.show} className="flex items-center gap-3 pb-2">
          <FloatInput 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={(e) => handleInputBlur(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInputBlur(e.target.value)}
            label="Search Decks..."
            className="w-[176px] border-gray-300 dark:border-[rgba(35,40,46,0.75)] py-2 pr-0 max-sm:text-sm"
            labelClassname="text-xs"
          />
        </motion.div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredDecks.map((deck) => (
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
                className={`absolute right-[20px] h-[35px] w-[35px] rounded top-6 z-50 animate-bounce ease-linear [animation-duration:_1.5s] hover:bg-[none] bg-[none] hover:text-[none] ${loading === deck.id ? "text-gray-300 dark:text-gray-600" : "text-red-400"}`}
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

      {!filteredDecks.length && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center gap-2 w-fit mx-auto max-sm:text-sm font-medium text-muted-foreground sm:border border-gray-300 dark:border-[rgba(46,47,49,0.8)] md:py-[10px] md:pl-[25px] md:pr-[21px] rounded-lg">
            No decks found
            <SearchX className="h-[21px] w-[21px]" />
          </div>
        </div>
      )}
    </div>
  );
}