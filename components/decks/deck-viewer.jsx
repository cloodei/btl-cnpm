"use client";
import Link from "next/link";
import ReactCardFlip from "react-card-flip";
import CommentList from "../comments/comment-list";
import FavoritesButton from "../favorites-button";
import RatingButton from "../ratings-button";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CirclePlay, Pencil, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "../ui/input";

export default function DeckViewer({ deck, cards, permissions, userId, avgRating }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputValue, setInputValue] = useState(1);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const updateCardIndex = (newIndex) => {
    setCurrentCardIndex(newIndex);
    setInputValue(newIndex + 1);
  };

  const handlePrevCard = () => {
    if(currentCardIndex > 0) {
      updateCardIndex(currentCardIndex - 1);
    }
  };

  const handleNextCard = () => {
    if(currentCardIndex < cards.length - 1) {
      updateCardIndex(currentCardIndex + 1);
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleInputBlur = () => {
    let newIndex = inputValue - 1;
    if(isNaN(newIndex) || newIndex < 0) {
      newIndex = 0;
    }
    else if(newIndex >= cards.length) {
      newIndex = cards.length - 1;
    }
    updateCardIndex(newIndex);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-6 min-h-[calc(100vh-48px)]">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h1 className="md:text-4xl text-3xl font-bold truncate overflow-hidden [text-shadow:_0_2px_5px_rgb(23_23_36_/_0.45)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]" title={deck.name}>
            {deck.name}
          </h1>
          <div className="flex gap-2 ml-2">
            <Link href={`/decks/${deck.id}/quiz`} className="sm:block hidden">
              <Button variant="expandIconOutline" Icon={CirclePlay} iconPlacement="left" className="transition-all ease-out hover:gap-2">
                Start Test
              </Button>
            </Link>
            <Link href={`/decks/${deck.id}/quiz`} className="sm:hidden block border border-gray-200 dark:border-secondary rounded-md py-[7px] px-[15px] transition duration-200 hover:bg-secondary hover:bg-opacity-10">
              <Play className="h-5 w-5 text-primary" />
            </Link>
            {permissions ? (
              <>
                <Link href={`/decks/${deck.id}/edit`} className="sm:block hidden">
                  <Button variant="expandIconOutline" Icon={Pencil} iconPlacement="left" className="transition-all ease-out hover:gap-2">
                    Edit Deck
                  </Button>
                </Link>
                <Link href={`/decks/${deck.id}/edit`} className="sm:hidden block border border-gray-200 dark:border-secondary rounded-md py-[7px] px-[15px] transition duration-200 hover:bg-secondary hover:bg-opacity-10">
                  <Pencil className="h-5 w-5 text-primary" />
                </Link>
              </>
            )
            : (
              <>
                <FavoritesButton deckId={deck.id} is_favorite={deck.is_favorite} size="5" userId={userId} />
                <RatingButton deckId={deck.id} userId={userId} avgRating={avgRating} />
              </>
            )}
          </div>
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
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerClassName="h-full">
          <div className="h-full cursor-pointer rounded-xl p-8 bg-card border dark:border-[#303242] shadow-[0_2px_9px_rgba(0,0,0,0.26)]" onClick={handleFlip}>
            <div className="flex flex-col justify-center items-center h-full">
              <p className="md:text-3xl text-2xl font-semibold text-center">
                {cards[currentCardIndex].front}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Click to flip
              </p>
            </div>
          </div>
          <div className="h-full cursor-pointer rounded-xl p-8 bg-card border dark:border-[#303242] shadow-[0_2px_9px_rgba(0,0,0,0.26)]" onClick={handleFlip}>
            <div className="flex flex-col justify-center items-center h-full">
              <p className="md:text-3xl text-2xl font-semibold text-center">
                {cards[currentCardIndex].back}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Click to flip back
              </p>
            </div>
          </div>
        </ReactCardFlip>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button variant="outline" size="lg" onClick={handlePrevCard} disabled={currentCardIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Input
          type="number"
          min={1}
          max={cards.length}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
          className="md:w-[68px] w-16 text-center text-sm md:text-base text-primary pr-1 pl-5 py-[10px]"
        />
        <Button variant="outline" size="lg" onClick={handleNextCard} disabled={currentCardIndex === cards.length - 1}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {deck.public && <CommentList deckId={deck.id} userId={userId} />}
    </div>
  );
}