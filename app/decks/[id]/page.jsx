import DeckViewer from "@/components/decks/deck-viewer";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";

function DeckException(message) {
  return (
    <div className="m-auto py-14 pb-8 text-center text-4xl font-medium text-red-500">
      {message}
    </div>
  )
}

export default async function DeckPage({ params }) {
  const { id } = await params;
  const deckId = parseInt(id);
  const { userId } = await auth();
  if(!userId) {
    return DeckException("User not found!");
  }
  if(deckId > 10 && deckId < 14) {
    const result = await getFeaturedDeck({ deckId, userId });
    return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} />;
  }
  const result = await getCachedDeck({ deckId, userId });
  if(!result.success) {
    return DeckException("Deck not found!");
  }
  return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} />;
}