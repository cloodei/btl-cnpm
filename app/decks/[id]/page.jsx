import DeckViewer from "@/components/decks/deck-viewer";
import { auth } from "@clerk/nextjs/server";
import { getDeck } from "@/app/actions/deck";
import { Suspense } from "react";

async function PageWrapper({ id }) {
  try {
    const { userId } = await auth();
    if(!userId) {
      throw new Error("User not found!");
    }
    const result = await getDeck(parseInt(id), userId);
    if(!result.success) {
      throw new Error("Deck not found or you don't have permission to view it...");
    }
    return (
      <DeckViewer deck={result.deck} cards={result.cards} />
    );
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

  return (
    <Suspense fallback={<div className="m-auto lg:pt-20 md:pt-16 pt-12 pb-8 text-center lg:text-4xl text-3xl font-medium">Fetching cards...</div>}>
      <PageWrapper id={id} />
    </Suspense>
  );
}