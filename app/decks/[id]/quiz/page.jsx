import QuizPageClient from "./quiz-client";
import Link from "next/link";
import { getCachedDeck, getFeaturedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

function IneligibleDeck({ message = "This deck is not eligible for a test", cardCount = null }) {
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
  if(deckId === 9 || deckId === 11 || deckId === 12) {
    const { deck, cards } = await getFeaturedDeck({ deckId, userId });
    return <QuizPageClient deckTitle={deck.title} cards={cards} />
  }
  const { success, deck, cards, error } = await getCachedDeck({ deckId, userId });
  if(!success) {
    const err = error?.message || error || "Failed to load deck";
    return <IneligibleDeck message={err} />;
  }
  if(cards.length < 3) {
    return <IneligibleDeck message={"Not enough cards for a test"} cardCount={cards.length} />;
  }
  return <QuizPageClient deckTitle={deck.title} cards={cards} />;
}