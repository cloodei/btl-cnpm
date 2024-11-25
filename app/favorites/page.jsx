import Link from "next/link";
import FavoritesClient from "@/components/decks/favorites-client";
import { auth } from "@clerk/nextjs/server";
import { getFavoriteDecksWithCardsCount } from "../actions/deck";
import { Suspense } from "react";
import { FancySpinner } from "@/components/ui/fancy-spinner";

async function FavoritesContent() {
  const { userId } = await auth();
  if(!userId) {
    return <EmptyState message="Please sign in to view favorites" />;
  }
  const { success, decks } = await getFavoriteDecksWithCardsCount(userId);
  if(!success || !decks?.length) {
    return (
      <EmptyState message="Your favorites list is empty" description="Start adding decks to your favorites!" />
    );
  }
  return <FavoritesClient decks={decks} />;
}

function EmptyState({ message, description }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">{message}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
        <Link href="/explore" className="inline-block">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Explore Decks
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <FancySpinner text="Loading your favorites..." size={32} />
      </div>
    }>
      <FavoritesContent />
    </Suspense>
  );
}