import Link from "next/link";
import FavoritesClient from "@/components/decks/favorites-client";
import { auth } from "@clerk/nextjs/server";
import { getFavoriteDecksWithCardsCount } from "../actions/deck";

function EmptyState({ err = "An unexpected error has occurred", description = null }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl text-[28px] md:text-4xl font-semibold">{err}</h2>
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

export default async function FavoritesPage() {
  const { userId } = await auth();
  if(!userId) {
    return <EmptyState err="Please sign in to view favorites" />
  }
  const { success, decks } = await getFavoriteDecksWithCardsCount(userId);
  if(!success || !decks?.length) {
    return <EmptyState err="Your favorites list is empty" description="Start adding decks to your favorites!" />
  }
  return <FavoritesClient decks={decks} />
}