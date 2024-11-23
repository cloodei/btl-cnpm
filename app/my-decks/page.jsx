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
    return (
      <MyDecksClient decks={result?.decks} />
    );
  }
  catch(error) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "calc(90vh - 48px)" }}>
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-4">
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