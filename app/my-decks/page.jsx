import Link from "next/link";
import MyDecksClient from "@/components/decks/my-deck-client";
import { auth } from "@clerk/nextjs/server";
import { getCachedDecksWithCardsCount } from "../actions/deck";

function DecksException({ err = "An error occurred" }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-2">
      <div className="text-center space-y-4">
        <h2 className="text-3xl text-[28px] md:text-4xl font-semibold">{err}</h2>
        <p className="text-muted-foreground">
          {(err === "You haven't created any decks yet") ? "Create a new deck to get started!" : "Please try again later"}
        </p>
        <Link href="/create" className="inline-block">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Create a Deck
          </button>
        </Link>
      </div>
    </div>
  );
}

export default async function MyDecksPage() {
  const { userId } = await auth();
  if(!userId) {
    return <DecksException err="Please sign in to view your decks" />;
  }
  const { success, decks } = await getCachedDecksWithCardsCount(userId);
  if(!success) {
    return <DecksException err="Failed to fetch your decks" />;
  }
  if(!decks?.length) {
    return <DecksException err="You haven't created any decks yet" />;
  }
  return <MyDecksClient decks={decks} />
}