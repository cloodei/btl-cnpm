import DeckViewer from "@/components/decks/deck-viewer";
import { Suspense } from "react";
import { FancySpinner } from "@/components/ui/fancy-spinner";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";

async function PageWrapper({ id }) {
  const { userId } = await auth();
  if(!userId) {
    return (
      <div className="m-auto py-14 pb-8 text-center text-4xl font-medium text-red-500">
        User not found!
      </div>
    );
  }
  if(id === 11 || id === 12 || id === 13) {
    const result = await getFeaturedDeck({ deckId: id, userId });
    return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} />;
  }
  try {
    const result = await getCachedDeck({ deckId: id, userId });
    if(!result.success || (!result.deck.public && result.deck.creator_id !== userId)) {
      throw new Error("Deck not found or you don't have permission to view it...");
    }
    return <DeckViewer deck={result.deck} cards={result.cards} userId={userId} permissions={result.deck.creator_id === userId} />;
  }
  catch(error) {
    return (
      <div className="m-auto py-14 pb-8 text-center text-4xl font-medium text-red-500">
        {error.message ? error.message : (error ? error : "An error occurred")}
      </div>
    );
  }
}

export default async function DeckPage({ params }) {
  const { id } = await params;
  const ID = parseInt(id);

  return (
    <Suspense fallback={(
      <div className="m-auto lg:pt-20 md:pt-16 pt-12 pb-8 text-center lg:text-4xl text-3xl font-medium">
        <FancySpinner text="Loading deck..." size={30} />
      </div>
    )}>
      <PageWrapper id={ID} />
    </Suspense>
  );
}