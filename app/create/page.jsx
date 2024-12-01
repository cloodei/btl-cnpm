"use client";
export const dynamic = "force-static";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatTextarea, FloatInput } from "@/components/ui/float-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Save, X } from "lucide-react";
import { createDeck } from "@/app/actions/deck";
import { useToast } from "@/hooks/use-toast";

export default function CreateComponent() {
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const bottomRef = useRef(null);

  const handleSave = async () => {
    const title = deckTitle.trim();
    if(!title) {
      toast({
        title: "Error",
        description: "Deck title is required!",
        variant: "destructive",
        duration: 2400,
      });
      setIsOpen(false);
      return;
    }
    if(title > 64) {
      toast({
        title: "Error",
        description: "Deck title must be 64 characters or less",
        variant: "destructive",
        duration: 2400,
      });
      setIsOpen(false);
      return;
    }
    let validCards = [];
    for(let i = 0; i < cards.length; i++) {
      const front = cards[i].front.trim();
      const back = cards[i].back.trim();
      if(front && back) {
        validCards.push({ front, back });
      }
    }
    if(!validCards.length) {
      toast({
        title: "Error",
        description: "Deck must have at least one complete card!",
        variant: "destructive",
        duration: 2400,
      });
      setIsOpen(false);
      return;
    }
    setIsSaving(true);
    const { success, error } = await createDeck({ title, isPublic, cards: validCards });
    if(success) {
      toast({
        title: "Success!",
        description: "Your deck has been created successfully.",
        duration: 2400,
      });
      setCards([{ front: "", back: "" }]);
      setDeckTitle("");
      setIsPublic(false);
    }
    else {
      toast({
        title: "Error",
        description: error?.message || error || "An error occurred",
        variant: "destructive",
        duration: 2400,
      });
    }
    setIsSaving(false);
    setIsOpen(false);
  };

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 25);
  };

  const deleteCard = (index) => {
    const newCards = cards.filter((_, idx) => idx !== index);
    setCards(newCards);
  };

  const updateCard = (index, side, value) => {
    const newCards = [...cards];
    newCards[index][side] = value;
    setCards(newCards);
  };

  const generateDescription = () => {
    const complete = []
    const incomplete = []
    for(const card of cards) {
      if(card.front.trim() && card.back.trim()) {
        complete.push(1);
      }
      else {
        incomplete.push(1);
      }
    }
    return `Saving will create a new flashcard deck with ${complete.length} cards.\n${incomplete.length ? `${incomplete.length > 1 ? `${incomplete.length} cards are` : "One card is"} incomplete and will not be saved.` : ""}`;
  }

  return (
  <>
    <div className="container mx-auto px-6 pt-8 pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-none">
          <h1 className="md:text-3xl text-2xl font-bold [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
            Create New Flashcard Deck
          </h1>
          <Button onClick={() => setIsOpen(true)}>
            <Save className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
        <div className="mb-5 shadow-md">
          <FloatInput label="Deck Title" value={deckTitle} className="border-gray-300 dark:border-[#282e41] font-medium" onChange={(e) => setDeckTitle(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2 mb-5 pl-2">
          <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
          <Label htmlFor="public">Make deck public</Label>
        </div>
        
        <div className="lg:space-y-[36px] space-y-6 shadow-sm">
          {cards.map((card, index) => (
            <Card key={index} className="dark:border-[#232a33] shadow-[0_1px_12px_rgba(0,0,0,0.24)] dark:shadow-none">
              <div className="font-medium pt-3 pl-5 pr-4 text-[22px] flex items-center justify-between">
                <span>Card {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => deleteCard(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 p-6 pt-5">
                <FloatTextarea
                  label="Enter front side content"
                  value={card.front}
                  onChange={(e) => updateCard(index, "front", e.target.value)}
                  className="border-gray-300 dark:border-[#212533bb] px-[18px] text-lg md:h-[140px] h-[120px]"
                  maxLength={128}
                />
                <FloatTextarea
                  label="Enter back side content"
                  value={card.back}
                  onChange={(e) => updateCard(index, "back", e.target.value)}
                  className="border-gray-300 dark:border-[#212533bb] px-[18px] text-lg md:h-[140px] h-[120px]"
                  maxLength={128}
                />
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

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[408px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Save Deck</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {generateDescription()}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex gap-2">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}