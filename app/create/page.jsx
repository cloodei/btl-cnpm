"use client";
export const dynamic = "force-static";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X } from "lucide-react";
import { FloatInput } from "@/components/ui/float-input";
import { useRef, useState } from "react";
import styles from "@/app/styles/create.module.css"

export default function CreateComponent() {
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [deckTitle, setDeckTitle] = useState("");
  const bottomRef = useRef(null);

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 25);
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
    1;
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-none">
          <h1 className="text-3xl font-bold">Create New Flashcard Deck</h1>
          <Button onClick={saveDeck}>
            <Save className="mr-2 h-4 w-4" />
            Save Deck
          </Button>
        </div>

        <div className="mb-8 shadow-sm">
          <FloatInput
            label="Deck Title"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="border-gray-300 dark:border-[#282e41] font-medium"
          />
        </div>

        <div className="lg:space-y-[36px] space-y-6 shadow-sm border-none">
          {cards.map((card, index) => (
            <Card key={index} className={`border-none ${styles.shadow}`}>
              <div className="font-medium pt-3 pl-5 pr-4 text-[22px] flex items-center justify-between">
                <span>
                  Card {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => deleteCard(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="border-gray-300 dark:border-[#282e41] grid md:grid-cols-2 gap-4 p-6 pt-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Front</label>
                  <Textarea
                    placeholder="Enter front side content"
                    value={card.front}
                    onChange={(e) => updateCard(index, "front", e.target.value)}
                    className="border-gray-300 dark:border-[#282e41] h-32 px-[18px] py-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Back</label>
                  <Textarea
                    placeholder="Enter back side content"
                    value={card.back}
                    onChange={(e) => updateCard(index, "back", e.target.value)}
                    className="border-gray-300 dark:border-[#282e41] h-32 px-[18px] py-[14px]"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div ref={bottomRef} className="border-gray-300 dark:border-[#282e41] lg:mt-11 mt-8 shadow-sm" style={{ scrollMarginBottom: "32px" }}>
          <Button onClick={addCard} className="border-gray-400 dark:border-[#3c4152] w-full hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
            <Plus className="border-gray-300 dark:border-[#282e41] mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>
    </div>
  );
}