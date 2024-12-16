import UpdateDeckComponent from "@/components/decks/update-deck-client";
import Link from "next/link";
import DeckViewerSkeleton from "@/components/dv-skeleton";
import { getCachedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const metadata = {
  title: "Edit | CoinCard",
};

const DeckException = ({ message }) => {
  return (
    <div className="m-auto py-12">
      <p className="text-center text-2xl md:text-3xl md:tracking-tight text-rose-700 dark:text-red-500 font-semibold">
        {message}
      </p>
      <div className="flex items-center justify-center gap-3 mt-4">
        <Link href="/my-decks" prefetch={true}>
          <Button>Back to Decks</Button>
        </Link>
        <Link href="/" prefetch={true}>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default async function EditDeckPage({ params }) {
  const { id } = await params;

  const EditWrapper = async () => {
    const deckId = parseInt(id);
    const { userId } = await auth();
    if(isNaN(deckId) || deckId < 1) {
      return <DeckException message="Invalid Deck. Please check the URL and try again." />
    }
    const { success, deck, cards, error } = await getCachedDeck({ deckId, userId });
    if(!success) {
      const err = error?.message || error || "Failed to load deck";
      return <DeckException message={err} />
    }
    if(!deck) {
      return <DeckException message="Deck Not Found" />
    }
    if(deck.creator_id !== userId) {
      return <DeckException message="You are not authorized to edit this deck" />
    }
    return <UpdateDeckComponent deck={deck} cards={cards} userId={userId} />
  }

  return (
    <Suspense fallback={<DeckViewerSkeleton />}>
      <EditWrapper />
    </Suspense>
  );
}