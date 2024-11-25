import UpdateDeckComponent from "@/components/decks/update-deck-client";
import { Suspense } from "react";
import { FancySpinner } from "@/components/ui/fancy-spinner";
import { getCachedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";

async function PageWrapper({ id }) {
  try {
    const { userId } = await auth();
    if(!userId) {
      throw new Error("User not found!");
    }
    const result = await getCachedDeck({ deckId: parseInt(id), userId });
    if(!result.success || result.deck.creator_id !== userId) {
      throw new Error("Deck not found or no permission");
    }
    return <UpdateDeckComponent deck={result.deck} cards={result.cards} />;
  }
  catch(error) {
    return (
      <div className="m-auto py-14 text-center text-4xl font-medium text-red-500">
        {error.message ? error.message : (error ? error : "An error occurred")}
      </div>
    );
  }
}

export default async function EditDeckPage({ params }) {
  const { id } = await params;

  return (
    <Suspense fallback={(
      <div className="m-auto lg:pt-20 pt-12 text-center lg:text-4xl text-3xl">
        <FancySpinner text="Loading deck..." size={30} />
      </div>
    )}>
      <PageWrapper id={id} />
    </Suspense>
  );
}