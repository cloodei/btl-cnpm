"use client";
import CommentList from "@/components/comments/comment-list";
import FavoritesButton from "@/components/favorites-button";
import RatingButton from "@/components/ratings-button";
import CardFlip from "@/components/flip-card";
import { BookOpenText, ChevronLeft, ChevronRight, Cog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type DeckViewerProps = {
  deck: {
    id: number;
    creator_id: string;
    name: string;
    public: boolean;
    created_at: Date;
    updated_at: Date;
    username: string;
  };
  cards: {
    front: string;
    back: string;
  }[];
  permissions?: boolean;
  userId?: string;
  avgRating?: number;
  isFavorite?: boolean;
};

export default function DeckViewer({ deck, cards, permissions, userId, avgRating, isFavorite }: DeckViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [inputValue, setInputValue] = useState("1");
  const router = useRouter();
  
  const result = useMemo(() => {
    return { deckId: deck.id, userId, pub: deck.public, avgRating, isFavorite };
  }, []);

  useEffect(() => {
    router.prefetch(`/decks/${deck.id}/quiz`);
    if(permissions) {
      router.prefetch(`/decks/${deck.id}/edit`);
    }
  }, []);

  const updateCardIndex = (newIndex: number) => {
    setCurrentCardIndex(newIndex);
    setInputValue(String(newIndex + 1));
  };

  const handleInputBlur = () => {
    let newIndex = parseInt(inputValue) - 1;
    if(newIndex >= cards.length) {
      newIndex = cards.length - 1;
    }
    else if(newIndex < 0) {
      newIndex = 0;
    }
    updateCardIndex(newIndex);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-6 min-h-[calc(100vh-48px)]">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3" title={deck.name}>
          <h1 className="md:text-4xl text-2xl font-bold truncate overflow-hidden [text-shadow:_0_2px_5px_rgb(23_23_36_/_0.45)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
            {deck.name}
          </h1>
        </div>
        <div className="text-primary text-[12px] truncate mb-4 pl-1 pr-7" title={deck.name + ` from ${deck.username}`}>
          Going through  
          <span className="font-medium mx-[6px] truncate"> "{deck.name}" </span>
          <span className="text-gray-400 dark:text-gray-500">
            {permissions ? " created by you" : ` from ${deck.username}`}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={(currentCardIndex + 1) / cards.length * 100} className="w-full" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentCardIndex + 1} / {cards.length}
          </span>
        </div>
      </div>
      
      <div className="relative md:h-[264px] h-[228px] mb-8">
        <CardFlip key={currentCardIndex} front={cards[currentCardIndex].front} back={cards[currentCardIndex].back} />
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button variant="outline" size="lg" onClick={() => updateCardIndex(currentCardIndex - 1)} disabled={currentCardIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Input
          type="number"
          min="1"
          max={String(cards.length)}
          value={inputValue}
          onBlur={handleInputBlur}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
          className="md:w-[68px] w-16 text-center text-sm md:text-base text-primary pr-1 pl-5 py-[10px]"
        />
        <Button variant="outline" size="lg" onClick={() => updateCardIndex(currentCardIndex + 1)} disabled={currentCardIndex === cards.length - 1}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <h1 className="text-lg md:text-xl text-center tracking-tight font-semibold mt-7 mb-2">
        More Actions
      </h1>
      <div className="flex items-center gap-[14px] mx-auto w-fit">
        <Card
          className="flex flex-col cursor-pointer items-center gap-2 rounded-[7px] p-[10px] md:p-3 shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-all duration-200 hover:bg-secondary"
          onMouseDown={(e) => {
            e.preventDefault();
            router.push(`/decks/${deck.id}/quiz`);
          }}
        >
          <BookOpenText className="h-8 md:h-9 w-8 md:w-9 text-primary" />
          <p className="text-xs md:text-sm text-primary">
            Start Testing
          </p>
        </Card>
        {permissions ? (
          <Card
            className="flex flex-col cursor-pointer items-center gap-2 rounded-[7px] p-[10px] md:p-3 shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-all duration-200 hover:bg-secondary"
            onMouseDown={(e) => {
              e.preventDefault();
              router.push(`/decks/${deck.id}/edit`);
            }}
          >
            <Cog className="h-8 md:h-9 w-8 md:w-9 text-primary" />
            <p className="text-xs md:text-sm text-primary">
              Modify Deck
            </p>
          </Card>
        ) : (
          <>
            <FavoritesButton deckId={result.deckId} userId={result.userId} is_favorite={result.isFavorite} />
            <RatingButton deckId={result.deckId} userId={result.userId} avgRating={result.avgRating} />
          </>
        )}
      </div>

      <CommentList deckId={result.deckId} userId={result.userId} pub={result.pub} />
    </div>
  );
}
