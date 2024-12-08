import DeckViewer from "@/components/decks/deck-viewer";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from '@/components/ui/card';
import { BookX } from 'lucide-react';

const NFBoundary = () => {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <BookX className="h-24 w-24 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-rose-700 dark:text-rose-500">
            Deck Not Found
          </h2>
          <p className="text-muted-foreground">
            The deck you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary-foreground rounded-lg hover:bg-slate-200 dark:hover:bg-gray-800"
          >
            Return Home
          </Link>
        </div>
      </Card>
    </div>
  );
}

const DeckSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 pb-8 space-y-8">
      <div className="bg-muted rounded-lg animate-pulse" />
      <Skeleton className="w-full h-12" />
      <Card className="p-6">
        <Skeleton className="md:h-60 h-48 w-full mb-2" />
      </Card>
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-10 w-28 md:w-32 rounded-lg" />
        <Skeleton className="h-10 w-28 md:w-32 rounded-lg" />
      </div>
    </div>
  );
}

const DeckWrapper = async ({ id }) => {
  const deckId = parseInt(id);
  const { userId } = await auth();
  if(isNaN(deckId) || !userId) {
    return <NFBoundary />
  }
  if(deckId === 9 || deckId === 11 || deckId === 12) {
    const result = await getFeaturedDeck({ deckId, userId });
    return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} avgRating={result.avgRating} />
  }
  const { success, deck, cards, avgRating } = await getCachedDeck({ deckId, userId });
  if(!success || !deck) {
    return <NFBoundary />
  }
  return <DeckViewer deck={deck} cards={cards} userId={userId} permissions={deck.creator_id === userId} avgRating={avgRating} />
}

export default async function DeckPage({ params }) {
  const { id } = await params;

  return (
    <Suspense fallback={<DeckSkeleton />}>
      <DeckWrapper id={id} />
    </Suspense>
  );
}