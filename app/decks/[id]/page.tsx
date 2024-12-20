import DeckViewerSkeleton from "@/components/dv-skeleton";
import DeckViewer from "./deck-viewer";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getCachedDeck } from "@/app/actions/deck";
import { BookX } from 'lucide-react';

export const metadata = {
  title: "View | CoinCard",
};

const NFBoundary = ({ message = "", description = "The deck you're looking for doesn't exist or has been removed." }) => {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <BookX className="h-24 w-24 text-muted-foreground" />
          <h2 className="text-2xl font-semibold text-rose-700 dark:text-rose-500">
            {message}
          </h2>
          <p className="text-muted-foreground">
            {description}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary bg-primary-foreground rounded-lg hover:bg-slate-200 dark:hover:bg-gray-800"
            prefetch={true}
          >
            Return Home
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const DeckWrapper = async () => {
    const { id } = await params;
    const deckId = parseInt(id);
    if(isNaN(deckId) || deckId < 1) {
      return <NFBoundary message="Invalid Deck ID" description="Please check the URL and try again." />
    }
    const { userId } = await auth();
    if(!userId) {
      return <NFBoundary message="Unauthorized" description="You need to be logged in to view this deck." />
    }
    const revalidate = (deckId === 9 || deckId === 11 || deckId === 12) ? 900 : 120;
    const { success, deck, cards, avgRating, isFavorite, error } = await getCachedDeck({ deckId, userId, revalidate });
    if(!success) {
      const err: any = error;
      return <NFBoundary message={err?.message || err || "Failed to load deck"} />
    }
    if(!deck || !cards.length) {
      return <NFBoundary message="Deck Not Found" />
    }
    return <DeckViewer deck={deck} cards={cards} permissions={deck.creator_id === userId} userId={userId} avgRating={avgRating} isFavorite={isFavorite} />;
  }

  return (
    <Suspense fallback={<DeckViewerSkeleton />}>
      <DeckWrapper />
    </Suspense>
  );
}