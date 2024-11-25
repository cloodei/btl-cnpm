"use client";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FloatInput } from "@/components/ui/float-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Save, X } from "lucide-react";
import { createDeck } from "@/app/actions/deck";
import { useToast } from "@/hooks/use-toast";

export default function CreateComponent() {
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [deckTitle, setDeckTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const bottomRef = useRef(null);

  const handleSave = async () => {
    if(!deckTitle.trim()) {
      toast({
        title: "Error",
        description: "Deck title is required!",
        variant: "destructive",
        duration: 2400,
      });
      setIsOpen(false);
      return;
    }
    if(deckTitle.length > 64) {
      toast({
        title: "Error",
        description: "Deck title must be 64 characters or less",
        variant: "destructive",
        duration: 2400,
      });
      setIsOpen(false);
      return;
    }
    const validCards = cards.filter(card => card.front.trim() && card.back.trim());
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
    try {
      const result = await createDeck({ title: deckTitle, isPublic, cards: validCards });
      if(result.success) {
        toast({
          title: "Success!",
          description: "Your deck has been created successfully.",
          duration: 2400,
        });
        setCards([{ front: "", back: "" }]);
        setDeckTitle("");
      }
      else {
        toast({
          title: "Error",
          description: result.error?.message || result.error || "An error occurred",
          variant: "destructive",
          duration: 2400,
        });
      }
    }
    catch(error) {
      toast({
        title: "Error",
        description: error?.message || error || "An error occurred",
        variant: "destructive",
        duration: 2400,
      });
    }
    finally {
      setIsSaving(false);
      setIsOpen(false);
    }
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

  return (
  <>
    <div className="container mx-auto px-4 pt-8 pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-none">
          <h1 className="text-3xl font-bold">Create New Flashcard Deck</h1>
          <Button onClick={() => setIsOpen(true)}>
            <Save className="mr-2 h-4 w-4" />
            Save Deck
          </Button>
        </div>

        <div className="mb-8 shadow-md">
          <FloatInput
            label="Deck Title"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="border-gray-300 dark:border-[#282e41] font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 mb-8">
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public">Make deck public</Label>
        </div>
        
        <div className="lg:space-y-[36px] space-y-6 shadow-sm border-none">
          {cards.map((card, index) => (
            <Card key={index} className="border-none shadow-[0_1px_16px_rgba(64,86,109,0.29)]">
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

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Save Deck</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            This will create a new flashcard deck with {cards.filter(c => c.front && c.back).length} cards.
            {cards.some(c => !c.front || !c.back) && (" Incomplete cards will be removed.")}
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