"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, BookOpen, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTimeIndicator } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function FavoritesClient({ decks }) {
  return (
    <div className="bg-gradient-to-b from-background to-secondary/20 pt-8 px-4" style={{ minHeight: "calc(100vh - 48px)" }}>
      <div className="max-w-6xl mx-auto lg:pb-8 md:pb-7 pb-6">
        <div className="lg:flex lg:justify-between lg:items-center md:flex md:justify-between md:items-center lg:mb-8 md:mb-6 mb-4">
          <div className="mb-4">
            <h1 className="lg:text-4xl text-[28px] font-bold mb-2">Favorites Decklist</h1>
            <p className="text-muted-foreground text-sm">
              Your favorite decks are listed here. Keep them close!
            </p>
          </div>
          <Link href="/explore">
            <Button className="lg:px-4 pr-3 pl-2 lg:py-2 py-[4px] lg:text-base text-sm">
              <Plus className="lg:mr-2 mr-1 h-4 w-4" />
              Add More
            </Button>
          </Link>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <motion.div key={deck.id} variants={item}>
              <Card className="relative group transition-all duration-200 shadow-lg hover:shadow-[0_8px_36px_rgba(0,0,0,0.24)] hover:scale-[1.02] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.19)]">
                <Link href={`/decks/${deck.id}`}>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 pr-12">{deck.name}</h3>
                    <p className="text-muted-foreground mb-4">{deck.description}</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Cards</span>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {deck.totalcards}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created By</span>
                        <div className="flex items-center gap-[6px]">
                          <CircleUser className="h-4 w-4" />
                          <span>{deck.username}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Added Since</span>
                        <span>
                          {getTimeIndicator(deck.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}