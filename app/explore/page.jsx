import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, BookOpen, Crown } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import RecentTab from "@/components/explore-content/recent-tab";

const featured = [
  { id: 11, name: "Another Test", description: "Recommended by Experts", totalcards: 3 },
  { id: 12, name: "Special Test", description: "Highly Educative Card Selections", totalcards: 2 },
  { id: 13, name: "Official Test", description: "Learn from the best", totalcards: 5 },
];

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
          <section className="pb-6">
            <h2 className="text-2xl font-bold mb-4">Featured Decks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((deck, index) => (
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
              ))}
            </div>
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
          <Suspense fallback={<div className="text-center text-2xl py-8 text-muted-foreground">Loading Recent Decks...</div>}>
            <RecentTab />
          </Suspense>
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