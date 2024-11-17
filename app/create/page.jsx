"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X } from "lucide-react";
import { FloatInput } from "@/components/ui/float-input";

export default function CreatePage() {
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [deckTitle, setDeckTitle] = useState("");

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  const deleteCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const updateCard = (index, side, value) => {
    const newCards = [...cards];
    newCards[index][side] = value;
    setCards(newCards);
  };

  const saveDeck = () => {
    console.log("Saving deck:", { title: deckTitle, cards });
  };

  return (
    <div className="border-gray-300 dark:border-[#2d2e47] container mx-auto px-4 py-8">
      <div className="border-gray-300 dark:border-[#2d2e47] max-w-4xl mx-auto">
        <div className="border-gray-300 dark:border-[#2d2e47] flex justify-between items-center mb-8">
          <h1 className="border-gray-300 dark:border-[#2d2e47] text-3xl font-bold">Create New Flashcard Deck</h1>
          <Button onClick={saveDeck}>
            <Save className="border-gray-300 dark:border-[#2d2e47] mr-2 h-4 w-4" />
            Save Deck
          </Button>
        </div>

        <div className="border-gray-300 dark:border-[#2d2e47] mb-8 shadow-sm">
          <FloatInput
            label="Deck Title"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="border-gray-300 dark:border-[#2d2e47] font-medium"
          />
        </div>

        <div className="border-gray-300 dark:border-[#2d2e47] space-y-6 shadow-sm">
          {cards.map((card, index) => (
            <Card key={index} className="border-gray-300 dark:border-[#2d2e47] p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="border-gray-300 dark:border-[#2d2e47] absolute top-2 right-2 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => deleteCard(index)}
              >
                <X className="border-gray-300 dark:border-[#2d2e47] h-4 w-4" />
              </Button>
              <div className="border-gray-300 dark:border-[#2d2e47] grid md:grid-cols-2 gap-4">
                <div>
                  <label className="border-gray-300 dark:border-[#2d2e47] block text-sm font-medium mb-2">Front</label>
                  <Textarea
                    placeholder="Enter front side content"
                    value={card.front}
                    onChange={(e) => updateCard(index, "front", e.target.value)}
                    className="border-gray-300 dark:border-[#2d2e47] h-32"
                  />
                </div>
                <div>
                  <label className="border-gray-300 dark:border-[#2d2e47] block text-sm font-medium mb-2">Back</label>
                  <Textarea
                    placeholder="Enter back side content"
                    value={card.back}
                    onChange={(e) => updateCard(index, "back", e.target.value)}
                    className="border-gray-300 dark:border-[#2d2e47] h-32"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-gray-300 dark:border-[#2d2e47] mt-8 shadow-sm">
          <Button onClick={addCard} className="border-gray-300 dark:border-[#2d2e47] w-full" variant="outline">
            <Plus className="border-gray-300 dark:border-[#2d2e47] mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>
    </div>
  );
}
