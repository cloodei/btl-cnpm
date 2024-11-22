import { auth } from "@clerk/nextjs/server";
import MyDecksClient from "@/components/decks/my-deck-client";
import { getCachedDecksWithCardsCount } from "../actions/deck";
import { Suspense } from "react";

const fetchData = async () => {
  try {
    const { userId } = await auth();
    if(!userId) {
      return null;
    }
    const result = await getCachedDecksWithCardsCount(userId);
    if(!result.success) {
      return null
    }
    return result;
  }
  catch(error) {
    return null;
  }
}

export default async function MyDecksPage() {
  const result = await fetchData();

  return (
    <Suspense fallback={<div className="m-auto p-10 text-center text-4xl font-medium">Loading...</div>}>
      <MyDecksClient decks={result?.decks} />
    </Suspense>
  );
}