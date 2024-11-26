import DeckViewer from "@/components/decks/deck-viewer";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function DeckPage({ params }) {
  const { id } = await params;
  const deckId = parseInt(id);
  if(isNaN(deckId)) {
    notFound();
  }
  const { userId } = await auth();
  if(!userId) {
    return (
      <div className="m-auto py-14 pb-8 text-center text-4xl font-medium text-red-500">
        You need to be logged in to view this page.
      </div>
    );
  }
  if(deckId > 10 && deckId < 14) {
    const result = await getFeaturedDeck({ deckId, userId });
    return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} />;
  }
  const { success, deck, cards } = await getCachedDeck({ deckId, userId });
  if(!success || !deck) {
    notFound();
  }
  return <DeckViewer deck={deck} userId={userId} cards={cards} permissions={deck.creator_id === userId} />;
}