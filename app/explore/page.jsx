import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpenCheck, Users, BookOpen, Plus, Crown } from "lucide-react";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getCachedDecksWithCardsCount } from "../actions/deck";
import { FancySpinner } from "@/components/ui/fancy-spinner";
import Link from "next/link";
import RecentTab from "@/components/explore-content/recent-tab";

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
    let decks = null;
    if(result.decks.length > 4) {
      decks = [{}, {}, {}, {}];
      decks[0] = result.decks[0]; decks[1] = result.decks[1]; decks[2] = result.decks[2]; decks[3] = result.decks[3];
    }
    else {
      decks = result.decks;
    }
    if(!decks || !decks?.length) {
      throw new Error("Your decks are empty");
    }
    return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {decks.map((item, index) => (
        <Card key={index} className="p-4 hover:shadow-xl hover:scale-[1.02] transition-all">
          <h3 className="font-semibold mb-2">{item.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Pick up where you left off
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <BookOpenCheck className="h-4 w-4" />
              <span>{item.totalcards} Cards</span>
            </div>
            <Link href={`/decks/${item.id}`} passHref>
              <Button variant="secondary" className="bg-gray-200 dark:bg-gray-900 hover:bg-gray-400 dark:hover:bg-gray-950">Continue</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
    );
  }
  catch(error) {
    return (
      <div className="flex items-center justify-center mx-auto w-full">
        <div className="text-center mx-auto w-full">
          <h2 className="text-3xl font-semibold mb-4">
            {error.message ? error.message : (error ? error : "An error occurred")}!
          </h2>
          <p className="text-muted-foreground mb-3">You haven't created any flashcard decks yet.</p>
          <Link href="/create" className="w-full">
            <Button className="border-gray-400 dark:border-[#3c4152] w-[50%] hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
              <Plus className="border-gray-300 dark:border-[#282e41] mr-2 h-4 w-4" />
              Add Card
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}

function FeaturedDecksWrapper() {
  const decks = [
    { id: 11, name: "Another Test", description: "Recommended by Experts", totalcards: 3 },
    { id: 12, name: "Special Test", description: "Highly Educative Card Selections", totalcards: 2 },
    { id: 13, name: "Official Test", description: "Learn from the best", totalcards: 5 },
  ]
  return (
    decks.map((deck, index) => (
      <Card key={index} className="p-6 hover:shadow-xl hover:scale-[1.02] transition-all">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold">Featured</span>
        </div>
        <h3 className="text-2xl font-bold md:mb-[7px] mb-1">{deck.name}</h3>
        <div className="text-muted-foreground md:mb-[19px] mb-[13px] flex items-center lg:gap-2 gap-[6px]">
          <Crown className="h-4 w-4 text-primary font-semibold" />
          <span>{deck.description}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{deck.totalcards} cards</span>
          </div>
          <Link href={`/decks/${deck.id}`} passHref>
            <Button>Study Now</Button>
          </Link>
        </div>
      </Card>
    ))
  );
}

export default async function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="recommended" className="space-y-8">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-[400px] grid-cols-3">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="recommended" className="lg:space-y-[56px] space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Decks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeaturedDecksWrapper />
            </div>
          </section>

          <section className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Decks</h2>
              <Link href="/my-decks" passHref>
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <Suspense fallback={(
              <div className="m-auto p-4 text-center text-4xl font-medium">
                <FancySpinner text="Loading your decks..." size={20} />
              </div>
            )}>
              <PageWrapper />
            </Suspense>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Community Decks</h2>
              <Button variant="outline">Browse All</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6 hover:shadow-xl hover:scale-[1.02] transition-all">
                  <h3 className="text-xl font-bold mb-2">Python Data Structures</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete guide to Python's built-in data structures
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>2.4k</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>75 cards</span>
                      </div>
                    </div>
                    <Link href="https://www.geeksforgeeks.org/python-data-structures/" target="_blank" passHref>
                      <Button variant="secondary" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-800">Preview</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="recent">
          <RecentTab />
        </TabsContent>
        <TabsContent value="popular">
          <div className="text-center py-8 text-muted-foreground">
            Chưa có data Popular
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}