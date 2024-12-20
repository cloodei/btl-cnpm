import Link from "next/link";
import DeckSkeleton from "@/components/deck-skeleton";
import MyDecksClient from "./my-deck-client";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { getCachedDecksWithCardsCount } from "../actions/deck";

export const metadata = {
  title: 'My Decks | CoinCard',
};

const DecksException = ({ message }: { message: string }) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-2">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-semibold">
          {message}
        </h2>
        <p className="text-muted-foreground">
          {(message === "You haven't created any decks yet") ? "Create a new deck to get started!" : "Please try again later"}
        </p>
        <Link href="/create" className="inline-block">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Create a Deck
          </button>
        </Link>
      </div>
    </div>
  );
}

const MyDecksWrapper = async () => {
  const { userId } = await auth();
  if(!userId) {
    return <DecksException message="Please sign in to view your decks" />;
  }
  const { success, error, decks } = await getCachedDecksWithCardsCount(userId);
  if(!success) {
    const err = error as any;
    return <DecksException message={err?.message || err || "An error occurred"} />;
  }
  if(!decks?.length) {
    return <DecksException message="You haven't created any decks yet" />;
  }
  return <MyDecksClient decks={decks} />
}

export default function MyDecksPage() {
  return (
    <Suspense fallback={<DeckSkeleton />}>
      <MyDecksWrapper />
    </Suspense>
  )
}