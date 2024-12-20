import Link from "next/link";
import DeckViewerSkeleton from "@/components/dv-skeleton";
import UpdateDeckComponent from "./update-deck-client";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { getCachedDeck } from "@/app/actions/deck";

export const metadata = {
  title: "Edit | CoinCard",
};

const DeckException = ({ message }: { message: string }) => {
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

export default function EditDeckPage({ params }: { params: Promise<{ id: string }> }) {
  const EditWrapper = async () => {
    const { id } = await params;
    const deckId = parseInt(id);
    if(isNaN(deckId) || deckId < 1) {
      return <DeckException message="Invalid Deck. Please check the URL and try again." />
    }
    const { userId } = await auth();
    if(!userId) {
      return <DeckException message="You need to be logged in to edit this deck." />
    }
    const { success, deck, cards, error } = await getCachedDeck({ deckId, userId, revalidate: 120 });
    if(!success) {
      const err = error as any;
      return <DeckException message={err?.message || err || "Failed to load deck"} />
    }
    if(!deck) {
      return <DeckException message="Deck Not Found" />
    }
    if(deck.creator_id !== userId) {
      return <DeckException message="You are not authorized to edit this deck" />
    }
    return <UpdateDeckComponent deck={deck} cards={cards} />
  }

  return (
    <Suspense fallback={<DeckViewerSkeleton />}>
      <EditWrapper />
    </Suspense>
  );
}