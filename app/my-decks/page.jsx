import Link from "next/link";
import MyDecksClient from "@/components/decks/my-deck-client";
import { auth } from "@clerk/nextjs/server";
import { getCachedDecksWithCardsCount } from "../actions/deck";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function DecksException({ err = "An error occurred" }) {
  return (
    <div className="pt-8 px-4 lg:pb-8 md:pb-7 pb-6 max-w-6xl mx-auto">
      <div className="lg:flex lg:justify-between lg:items-center md:flex md:justify-between md:items-center lg:mb-8 md:mb-6 mb-4">
        <h1 className="lg:text-4xl text-[28px] font-bold mb-4">My Flashcard Decks</h1>
        <Link href="/create">
          <Button className="lg:px-4 pr-3 pl-2 lg:py-2 py-[4px] lg:text-base text-sm">
            <Plus className="lg:mr-2 mr-1 h-4 w-4" />
            Create New Deck
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4 text-red-500">
            An error occurred!
          </h2>
          <p className="text-muted-foreground mb-3">{err}</p>
          <Link href="/create" className="w-full">
            <Button className="border-gray-400 dark:border-[#3c4152] w-full hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
              <Plus className="border-gray-300 dark:border-[#282e41] mr-2 h-4 w-4" />
              Add Card
            </Button>
          </Link>
        </div>
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
    return <DecksException err="No decks found" />;
  }
  return <MyDecksClient decks={decks} />
}