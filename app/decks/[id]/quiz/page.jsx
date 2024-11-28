import QuizPageClient from "./quiz-client";
import Link from "next/link";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

function IneligibleDeck(message = "This deck is unavailable for tests", cardCount = 0) {
  return (
    <div className="m-auto pt-12 pb-8">
      <p className="text-center text-4xl font-medium text-red-500 mb-2 tracking-tighter">
        {message}
      </p>
      {cardCount && (
        <p className="text-center text-base font-medium text-muted-foreground pb-3">
          Deck has {cardCount} cards, you need 3 or more cards for a test.
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mt-4">
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

export default async function QuizPage({ params }) {
  const { id } = await params;
  const deckId = parseInt(id);
  const { userId } = auth();
  if(deckId > 10 && deckId < 14) {
    const result = await getFeaturedDeck({ deckId, userId });
    return <QuizPageClient deck={result} />
  }
  const result = await getCachedDeck({ deckId, userId });
  if(!result.success || !result?.deck) {
    return IneligibleDeck();
  }
  if(result.cards.length < 3) {
    return IneligibleDeck("This deck has too few cards to be tested", result.cards.length);
  }
  return <QuizPageClient deck={result} />
}