"use client";
import Link from "next/link";
import ReactCardFlip from "react-card-flip";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Settings, Heart, CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FavoritesButton from "../favorites-button";

export default function DeckViewer({ deck, cards, permissions, userId }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    document.querySelector('.react-card-flip').style.height = "100%";
  }, [deck]);

  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => (prev ? prev - 1 : prev));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="bg-gradient-to-b from-background to-secondary/20 pt-8 px-4" style={{ minHeight: "calc(100vh - 48px)" }}>
      <div className="max-w-4xl mx-auto lg:pb-8 md:pb-7 pb-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold truncate overflow-hidden" title={deck.name}>{deck.name}</h1>
            <div className="flex gap-2 ml-2">
              <Link href={`/decks/${deck.id}/quiz`}>
                <Button variant="outline">
                  <CirclePlay className="h-6 w-6" />
                  Begin Test
                </Button>
              </Link>
              {permissions ? (
                <Link href={`/decks/${deck.id}/edit`}>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              )
              : (
                <>
                  <FavoritesButton deckId={deck.id} is_favorite={deck.is_favorite} size="5" userId={userId} />
                  <Button variant="outline" size="icon" onClick={() => setIsLiked(!isLiked)} className={isLiked ? "text-red-500" : ""}>
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="font-medium text-primary truncate mb-4 pr-7" title={deck.name + ` from ${deck.username}`}>
            Going through  
            <span className="font-semibold md:mx-[5px] mx-[3px] truncate"> &lt;{deck.name}&gt; </span>
            <span className="text-gray-400 dark:text-gray-500">
              {` from ${deck.username}`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={(currentCardIndex + 1) / cards.length * 100} className="w-full" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentCardIndex + 1} / {cards.length}
            </span>
          </div>
        </div>

        <div className="relative lg:h-[280px] md:h-[232px] h-40 mb-8">
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" className="h-full">
            <div className="w-full h-full cursor-pointer" onClick={() => setIsFlipped(true)}>
              <div className="h-full bg-card rounded-xl p-8 dark:shadow-[0_4px_40px_rgba(64,86,109,0.28)] shadow-[0_8px_36px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col justify-center items-center h-full">
                  <p className="text-2xl font-medium text-center">
                    {cards[currentCardIndex].front}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
                </div>
              </div>
            </div>

            <div className="w-full h-full cursor-pointer" onClick={() => setIsFlipped(false)}>
              <div className="h-full bg-card rounded-xl p-8 dark:shadow-[0_4px_40px_rgba(64,86,109,0.28)] shadow-[0_8px_36px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col justify-center items-center h-full">
                  <p className="text-xl text-center">
                    {cards[currentCardIndex].back}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">Click to flip back</p>
                </div>
              </div>
            </div>
          </ReactCardFlip>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={handlePrevCard} disabled={currentCardIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="default" size="lg" onClick={handleNextCard} disabled={currentCardIndex === cards.length - 1}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}