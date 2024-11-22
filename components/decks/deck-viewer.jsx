"use client";

import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { ChevronLeft, ChevronRight, Bookmark, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function DeckViewer({ deck, cards }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.querySelector('.react-card-flip').style.height = "100%";
  }, [deck]);

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev ? prev - 1 : prev));
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
  };

  const handleShare = () => {
    toast({
      title: "Share link copied!",
      description: "The link to this deck has been copied to your clipboard.",
    });
  };

  return (
    <div className="bg-gradient-to-b from-background to-secondary/20 pt-8 px-4" style={{ minHeight: "calc(100vh - 48px)" }}>
      <div className="max-w-4xl mx-auto lg:pb-8 md:pb-7 pb-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">{deck.name}</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSaved(!isSaved)}
                className={isSaved ? "text-primary" : ""}
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Going through
            <span className="font-semibold text-primary"> {deck.name} </span>
          </p>
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
              <div className="h-full bg-card rounded-xl p-8 dark:shadow-[0_4px_40px_rgba(64,86,109,0.28)] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                <div className="flex flex-col justify-center items-center h-full">
                  <p className="text-2xl font-medium text-center">
                    {cards[currentCardIndex].front}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
                </div>
              </div>
            </div>

            <div className="w-full h-full cursor-pointer" onClick={() => setIsFlipped(false)}>
              <div className="h-full bg-card rounded-xl p-8 dark:shadow-[0_4px_40px_rgba(64,86,109,0.28)] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
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