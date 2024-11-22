import DeckViewer from "@/components/decks/deck-viewer";
import { auth } from "@clerk/nextjs/server";
import { getDeck } from "@/app/actions/deck";
import { Suspense } from "react";

const fetchData = async (id) => {
  try {
    const { userId } = await auth();
    const result = await getDeck(id, userId);
    if(!result.success) {
      return null
    }
    return result;
  }
  catch(error) {
    return null;
  }
}

export default async function DeckPage({ params }) {
  const { id } = await params;
  const { deck, cards } = await fetchData(id);

  return (
    <Suspense fallback={<div className="m-auto p-10 text-center text-4xl font-medium">Loading...</div>}>
      <DeckViewer deck={deck} cards={cards} />
    </Suspense>
  );
}