import UpdateDeckComponent from "@/components/decks/update-deck-client";
import Link from "next/link";
import { getCachedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

function DeckException({ message = "An error occurred" }) {
  return (
    <div className="m-auto pt-12 pb-8">
      <p className="text-center text-4xl font-medium text-red-500">{message}</p>
      <div className="flex items-center justify-center gap-3 mt-7">
        <Link href="/my-decks">
          <Button>Back to Decks</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default async function EditDeckPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();
  if(!userId) {
    return <DeckException message="Please sign in to edit your decks!" />;
  }
  const { success, deck, cards } = await getCachedDeck({ deckId: parseInt(id), userId });
  if(!success || !deck) {
    return <DeckException message="Failed to load deck" />;
  }
  if(deck.creator_id !== userId) {
    return <DeckException message="You are not authorized to edit this deck" />;
  }
  return <UpdateDeckComponent deck={deck} cards={cards} userId={userId} />;
}