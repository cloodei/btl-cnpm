"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ExplorePage() {
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
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 hover:shadow-xl hover:scale-[1.02] transition-all">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Featured</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">JavaScript Basics</h3>
                  <p className="text-muted-foreground mb-4">
                    Master the fundamentals of JavaScript programming
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>50 cards</span>
                    </div>
                    <Link href="https://www.w3schools.com/js/js_intro.asp" target="_blank" passHref>
                      <Button>Study Now</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Decks</h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["English", "Marxism Leninism", "Software Development", "Artificial Intelligence"].map((item, index) => (
                <Card key={index} className="p-4 hover:shadow-xl hover:scale-[1.02] transition-all">
                  <h3 className="font-semibold mb-2">{item}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Last studied 2 days ago
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>30 cards</span>
                    </div>
                    <Button variant="ghost" size="sm">Continue</Button>
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
          <div className="text-center py-8 text-muted-foreground">
            Chưa có data Recent
          </div>
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