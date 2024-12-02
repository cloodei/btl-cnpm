"use client";
import Link from 'next/link';
import FavoritesButton from '../favorites-button';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Settings2, Sparkle, Loader, CircleUser } from 'lucide-react';
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
        <Loader />
        <span className="font-medium">None</span>
      </>
    );
  }
  return (
    <>
      <Sparkle className='text-[#344fc9] dark:text-[#5654cf] drop-shadow-[0_1px_8px_rgba(86,84,207,0.5)]' />
      <span className="text-base font-medium">{avg_rating.toFixed(1)}</span>
    </>
  );
}

const generatePaginatedDeck = ({ decks, page }) => {
  const start = (page - 1) * 12;
  const end = page * 12;
  return decks.slice(start, end);
}

export default function CommunityTabClient({ decks, userId }) {
  const [paginatedDecks, setPaginatedDecks] = useState(generatePaginatedDeck({ decks, page: 1 }));
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDecks, setFilteredDecks] = useState(paginatedDecks);

  const filterDecks = (query) => {
    const filtered = paginatedDecks.filter((deck) => deck.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredDecks(filtered);
  };

  const handleInputBlur = (e) => {
    filterDecks(e.target.value.trim());
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      filterDecks(e.target.value.trim());
    }
  };

  const handleLoadMore = () => {
    const nextPage = Math.ceil(paginatedDecks.length / 12) + 1;
    const res = [...paginatedDecks, ...generatePaginatedDeck({ decks, page: nextPage })];
    setPaginatedDecks(res);
    setFilteredDecks(res);
  }

  return (
  <div className="pt-8 relative">
    <motion.div variants={item} initial="hidden" animate="show" className="absolute -top-9 right-0 z-5">
      <FloatInput 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        label="Search for decks"
        className="w-[160px] md:w-[264px] border-gray-300 dark:border-gray-800"
      />
    </motion.div>

    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    {filteredDecks.map((deck) => (
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
            </div>
          </Link>
        </Card>
      </motion.div>
    ))}
    </motion.div>

    {paginatedDecks.length < decks.length && (
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" className="w-full md:w-auto" onClick={handleLoadMore}>
          Load More
        </Button>
      </div>
    )}
  </div>
  );
}