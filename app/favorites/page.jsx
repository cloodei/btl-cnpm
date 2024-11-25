import Link from "next/link";
import FavoritesClient from "@/components/decks/favorites-client";
import { auth } from "@clerk/nextjs/server";
import { getFavoriteDecksWithCardsCount } from "../actions/deck";
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
    const result = await getFavoriteDecksWithCardsCount(userId);
    if(!result.success) {
      throw new Error("Error fetching decks");
    }
    if(!result.decks || !result.decks?.length) {
      throw new Error("Your favorites list is empty");
    }
    return (
      <FavoritesClient decks={result.decks} />
    );
  }
  catch(error) {
    return (
      <div className="pt-8 px-4 lg:pb-8 md:pb-7 pb-6 max-w-6xl mx-auto">
        <div className="md:flex md:items-center lg:mb-8 md:mb-6 mb-4">
          <h1 className="lg:text-4xl text-[28px] font-bold mb-4">Favorites Playlist</h1>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-3">
              {error.message ? error.message : (error ? error : "An error occurred")}!
            </h2>
            <p className="text-muted-foreground mb-3">You have no favorite decks yet.</p>
            <Link href="/explore" className="w-full">
              <Button className="border-gray-400 dark:border-[#3c4152] w-full hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
                <Plus className="border-gray-300 dark:border-[#282e41] mr-[2px] h-4 w-4" />
                Add Deck
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default async function FavoritesPage() {
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