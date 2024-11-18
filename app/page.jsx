"use client";
export const dynamic = 'force-static';

import { GraduationCap, Brain, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background dark:from-[#0f131b] to-secondary">
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Master Any Subject with Smart Flashcards
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8">
            Create, study, and share flashcards to accelerate your learning journey. Join thousands of students achieving their goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="lg:text-lg text-base px-5 lg:px-8">
                Create Flashcards
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="lg:text-lg text-base px-5 lg:px-8">
                Explore Decks
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
            <p className="text-muted-foreground">
              Enhanced learning with creative and accessible flashcards
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Custom Decks</h3>
            <p className="text-muted-foreground">
              Create and organize flashcards your way
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaborative</h3>
            <p className="text-muted-foreground">
              Share and study with friends and classmates
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generated Tests</h3>
            <p className="text-muted-foreground">
              Generate flashcards from your notes instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}