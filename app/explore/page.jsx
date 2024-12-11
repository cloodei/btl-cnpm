import Link from "next/link";
import CommunityTab from "@/components/explore-content/community-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Crown, Users } from "lucide-react";
import { Suspense } from "react";

const featured = [
  { id: 11, name: "Everyday Words: From English to French", description: "Quickstart Guide to speaking French", totalcards: 25 },
  { id: 12, name: "Vocabulary Expansion", description: "Highly Educative Expressions", totalcards: 20 },
  { id: 9, name: "French Foundations: Expanding Your Vocabulary", description: "Take your French to Exceeding Heights", totalcards: 40 },
];

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="recommended" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:w-[300px] w-[240px]">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="lg:space-y-[56px] space-y-8">
          <section className="pb-6">
            <h2 className="text-2xl font-bold mb-4 [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">Featured Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((deck, index) => (
                <Link href={`/decks/${deck.id}`} passHref key={index}>
                  <Card title={deck.name} className="p-6 shadow-[0_3px_4px_rgba(0,0,0,0.25)] dark:border-[#34393f] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:scale-[1.02]">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Featured</span>
                    </div>
                    <div className="pr-4">
                      <h3 className="text-2xl font-bold md:mb-[7px] truncate mb-1">{deck.name}</h3>
                    </div>
                    <div className="text-muted-foreground md:mb-[19px] mb-[13px] flex items-center lg:gap-2 gap-[6px]">
                      <Crown className="h-4 w-4 text-primary font-semibold" />
                      <span>{deck.description}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{deck.totalcards} cards</span>
                      </div>
                      <Button size="lg">Study Now</Button>
                    </div>
                  </Card>
                </Link>
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
                      <Button
                        variant="outline"
                        className="bg-gray-100/85 dark:bg-gray-800/75 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Preview
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="community" style={{ marginTop: 0 }}>
          <Suspense fallback={<div className="text-center text-2xl py-8 text-muted-foreground">Loading Community Decks...</div>}>
            <CommunityTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}