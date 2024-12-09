"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Settings2, CircleUser, ArrowLeftFromLine, SearchX, StarOff, Star, StarHalf } from 'lucide-react';
import { FloatInput } from '../ui/float-input';
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
  
const generateRating = (rating) => {
  const avg_rating = parseFloat(rating);
  if(!avg_rating || isNaN(avg_rating)) {
    return (
      <>
        <StarOff className="h-5 w-5" />
        <span className="font-medium">None</span>
      </>
    );
  }
  let level = (avg_rating <= 5 ? 0 : avg_rating <= 8 ? 1 : 2);
  return (
    <>
      {level === 0 ? (
        <StarHalf className="h-5 w-5 text-[#dfc42f] dark:text-[rgb(211,201,65)]" />
      ) : level === 1 ? (
        <Star className="h-5 w-5 text-[#dfc42f] dark:text-[rgb(211,201,65)]" />
      ) : (
        <div className="star-container">
          <Star className="h-5 w-5 fill-current text-[rgb(233,236,43)] dark:text-[rgb(211,201,65)]" />
        </div>
      )}
      <span className="text-sm font-medium">
        {avg_rating.toFixed(1)}
      </span>
      <span className="text-muted-foreground">
        / 10
      </span>
    </>
  );
}

const generatePaginatedDeck = (decks, page) => {
  const end = page * 8;
  return decks.slice(0, end);
}

export default function CommunityTabClient({ decks, userId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(decks);
  const [paginatedDecks, setPaginatedDecks] = useState(generatePaginatedDeck(decks, 1));

  const filterDecks = (query) => {
    const filtered = decks.filter((deck) => deck.name.toLowerCase().includes(query));
    setSearchResults(filtered);
    setCurrentPage(1);
    setPaginatedDecks(generatePaginatedDeck(filtered, 1));
  };

  const handleInputBlur = (e) => {
    const query = e.target.value.trim();
    if(query) {
      filterDecks(query.toLowerCase());
      return;
    }
    setSearchResults(decks);
    setCurrentPage(1);
    setPaginatedDecks(generatePaginatedDeck(decks, 1));
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      const query = e.target.value.trim();
      if(query) {
        filterDecks(query.toLowerCase());
        return;
      }
      setSearchResults(decks);
      setCurrentPage(1);
      setPaginatedDecks(generatePaginatedDeck(decks, 1));
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setPaginatedDecks(generatePaginatedDeck(searchResults, nextPage));
  }

  const handleShowAll = () => {
    setSearchResults(decks);
    setCurrentPage(1);
    setPaginatedDecks(generatePaginatedDeck(decks, 1));
  }

  return (
  <div className="pt-4 sm:pt-8 sm:relative">
    <motion.div variants={item} initial="hidden" animate="show" className="sm:absolute sm:-top-9 sm:right-0 sm:z-5 pb-6">
      <FloatInput 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        label="Search Decks"
        className="max-sm:w-[212px] border-gray-300 dark:border-gray-800 max-sm:pt-[7px] max-sm:pb-[8px] max-sm:text-sm"
        labelClassname="max-sm:text-xs max-sm:left-[9px] max-sm:top-[9px]"
      />
    </motion.div>

    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5">
    {paginatedDecks.length ? paginatedDecks.map((deck) => (
      <motion.div key={deck.id} variants={item}>
        <Card className="relative group transition-all [transition-duration:_250ms] [animation-duration:_250ms] dark:border-[#272a31] shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:scale-[1.03]">
          {(userId === deck.creator_id) && (
            <Link href={`/decks/${deck.id}/edit`} className="absolute top-[10px] lg:top-[14px] right-[20px] transition hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full p-2">
              <Settings2 className="h-6 lg:h-4 w-6 lg:w-4" />
            </Link>
          )}
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
    )) : null}
    </motion.div>

    {!paginatedDecks.length ? (
      <div className="w-full mt-3">
        <p className="flex items-center justify-center gap-[6px] text-lg font-semibold text-muted-foreground text-center">
          No decks found
          <SearchX className="h-6 w-6" />
        </p>
        <Button variant="outline" size="lg" className="mt-[10px] ml-[calc(50%-66px)]" onClick={handleShowAll}>
          Show All
        </Button>
      </div>
    ) :
    (paginatedDecks.length < searchResults.length) ? (
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" className="w-full md:w-auto shadow-[0_1px_3px_rgba(0,0,0,0.25)] dark:border-[#34393f]" onClick={handleLoadMore}>
          Load More
        </Button>
      </div>
    ) : null}
  </div>
  );
}