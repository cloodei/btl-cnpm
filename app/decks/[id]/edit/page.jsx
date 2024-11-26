import UpdateDeckComponent from "@/components/decks/update-deck-client";
import { getCachedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";

function DeckException(message) {
  return (
    <div className="m-auto py-14 pb-8 text-center text-4xl font-medium text-red-500">
      {message}
    </div>
  )
}

export default async function EditDeckPage({ params }) {
  const { id } = await params;
  const { userId } = await auth();
  if(!userId) {
    return DeckException("User not found!");
  }
  const { success, deck, cards } = await getCachedDeck({ deckId: parseInt(id), userId });
  if(!success || !deck) {
    return DeckException("Deck not found!");
  }
  if(deck.creator_id !== userId) {
    return DeckException("You do not have permission to edit this deck!");
  }
  return <UpdateDeckComponent deck={deck} cards={cards} userId={userId} />;
}