import Link from "next/link";
import MyDecksClient from "@/components/decks/my-deck-client";
import { auth } from "@clerk/nextjs/server";
import { getCachedDecksWithCardsCount } from "../actions/deck";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FancySpinner } from "@/components/ui/fancy-spinner";

async function PageWrapper() {
  try {
    const { userId } = await auth();
    if(!userId) {
      throw new Error("User not found");
    }
    const result = await getCachedDecksWithCardsCount(userId);
    if(!result.success) {
      throw new Error("Error fetching decks");
    }
    if(!result.decks || !result.decks?.length) {
      throw new Error("Your decks are empty");
    }
    return (
      <MyDecksClient decks={result.decks} />
    );
  }
  catch(error) {
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
            <h2 className="text-2xl font-medium mb-4">
              {error.message ? error.message : (error ? error : "An error occurred")}!
            </h2>
            <p className="text-muted-foreground mb-3">You haven't created any flashcard decks yet.</p>
            <Link href="/create" className="w-full">
              <Button className="border-gray-400 dark:border-[#3c4152] w-full hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
                <Plus className="border-gray-300 dark:border-[#282e41] mr-2 h-4 w-4" />
                Add Card
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default async function MyDecksPage() {
  return (
    <Suspense fallback={(
      <div className="m-auto p-10 text-center text-4xl font-medium">
        <FancySpinner text="Loading decks..." size={30} />
      </div>
    )}>
      <PageWrapper />
    </Suspense>
  );
}