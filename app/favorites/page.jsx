import Link from "next/link";
import FavoritesClient from "./favorites-client";
import DeckSkeleton from "@/components/deck-skeleton";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { getFavoriteDecksWithCardsCount } from "../actions/deck";

export const metadata = {
  title: 'Favorites | CoinCard'
};

const EmptyState = ({ message, description = null }) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl text-[28px] md:text-4xl font-semibold">
          {message}
        </h2>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
        <Link href="/explore" className="inline-block" prefetch={true}>
          <Button>
            Explore Decks
          </Button>
        </Link>
      </div>
    </div>
  );
}

const FavoritesWrapper = async () => {
  const { userId } = await auth();
  if(!userId) {
    return <EmptyState message="Please sign in to view favorites" />
  }
  const { success, decks, error } = await getFavoriteDecksWithCardsCount(userId);
  if(!success) {
    const err = error?.message || error || "An error occurred";
    return <EmptyState message={err} description="Please try again later" />
  }
  if(!decks?.length) {
    return <EmptyState message="No favorite decks" description="Start adding decks to your favorites!" />
  }
  return <FavoritesClient decks={decks} userId={userId} />
}

export default async function FavoritesPage() {
  return (
    <Suspense fallback={<DeckSkeleton />}>
      <FavoritesWrapper />
    </Suspense>
  )
}