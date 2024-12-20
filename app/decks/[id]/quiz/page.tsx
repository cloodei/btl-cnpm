import QuizPageClient from "./quiz-client";
import Link from "next/link";
import DeckViewerSkeleton from "@/components/dv-skeleton";
import { getCachedDeck } from "@/app/actions/deck";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const metadata = {
  title: "Quiz | CoinCard",
};

const IneligibleDeck = ({ message, cardCount = null }: { message: string, cardCount?: number | null }) => {
  return (
    <div className="m-auto pt-12 pb-8">
      <p className={`text-center text-4xl font-medium mb-2 tracking-tighter ${cardCount ? "text-primary" : "text-rose-700"}`}>
        {message}
      </p>
      {cardCount && (
        <p className="text-center text-base font-medium text-muted-foreground pb-3">
          Deck has {cardCount} cards, you need 4 or more cards for a test.
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mt-4">
        <Link href="/my-decks" prefetch={true}>
          <Button>Back to Decks</Button>
        </Link>
        <Link href="/" prefetch={true}>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const QuizPageWrapper = async () => {
    const { id } = await params;
    const deckId = parseInt(id);
    const { userId } = await auth();
    if(!userId) {
      return <IneligibleDeck message="Unauthorized" />;
    }
    const revalidate = (deckId === 9 || deckId === 11 || deckId === 12) ? 900 : 120;
    const { success, deck, cards, error } = await getCachedDeck({ deckId, userId, revalidate });
    if(!success) {
      const err = error as any;
      return <IneligibleDeck message={err?.message || err || "Failed to load deck"} />;
    }
    if(!cards || cards.length < 4) {
      return <IneligibleDeck message="Not enough cards for a test" cardCount={cards?.length} />;
    }
    return <QuizPageClient deckTitle={deck.name} cards={cards} />;
  }

  return (
    <Suspense fallback={<DeckViewerSkeleton />}>
      <QuizPageWrapper />
    </Suspense>
  );
}