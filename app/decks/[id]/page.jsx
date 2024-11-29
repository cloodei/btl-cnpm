import DeckViewer from "@/components/decks/deck-viewer";
import Link from "next/link";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DeckPage({ params }) {
  const { id } = await params;
  const deckId = parseInt(id);
  if(isNaN(deckId)) {
    notFound();
  }
  const { userId } = await auth();
  if(!userId) {
    return (
      <div className="m-auto pt-12 pb-8">
        <p className="text-center text-4xl font-medium text-red-500">
          You must be logged in to view this deck.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <Link href="/my-decks">
            <Button>Back to Decks</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  if(deckId === 9 || deckId === 11 || deckId === 12) {
    const result = await getFeaturedDeck({ deckId, userId });
    return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} />;
  }
  const { success, deck, cards } = await getCachedDeck({ deckId, userId });
  if(!success || !deck) {
    notFound();
  }
  return <DeckViewer deck={deck} userId={userId} cards={cards} permissions={deck.creator_id === userId} />;
}