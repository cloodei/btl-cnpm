"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { FloatInput, FloatTextarea } from "@/components/ui/float-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2, X, Loader2 } from "lucide-react";
import { updateDeck, deleteDeck } from "@/app/actions/deck";
import { useToast } from "@/hooks/use-toast";

export default function UpdateDeckComponent({ deck, cards: initialCards }) {
  const [cards, setCards] = useState(initialCards);
  const [isWaiting, setIsWaiting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(0);
  const [isPublic, setIsPublic] = useState(deck.public);
  const [deckTitle, setDeckTitle] = useState(deck.name);
  const bottomRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async () => {
    const title = deckTitle.trim();
    if(!title || title.length > 64 || title.length < 4) {
      toast({
        title: "Error",
        description: "Deck title must have at least 4 characters or 64 characters and less",
        variant: "destructive",
        duration: 2400
      });
      setOpenDialog(false);
      return;
    }
    let validCards = [];
    for(let i = 0; i < cards.length; i++) {
      const front = cards[i].front.trim();
      const back = cards[i].back.trim();
      if(front && back) {
        validCards.push({ deck_id: deck.id, front, back });
      }
    }
    if(!validCards.length) {
      toast({
        title: "Error",
        description: "Please add at least one complete card",
        variant: "destructive",
        duration: 2400
      });
      setOpenDialog(false);
      return;
    }
    setIsWaiting(true);
    const { success, error } = await updateDeck({ deckId: deck.id, title, cards: validCards, isPublic });
    if(success) {
      toast({
        title: "Success!",
        description: "Deck updated successfully",
        duration: 2400
      });
      router.push('/my-decks');
    }
    else {
      toast({
        title: "Error",
        description: error?.message || error || "Failed to update deck",
        variant: "destructive",
        duration: 2400
      });
    }
    setIsWaiting(false);
    setOpenDialog(false);
  };

  const handleDeleteDeck = async () => {
    setIsWaiting(true);
    const { success, error } = await deleteDeck(deck.id);
    if(success) {
      toast({
        title: "Success",
        description: "Deck deleted successfully",
        duration: 2400
      });
      router.push('/my-decks');
    }
    else {
      toast({
        title: "Error",
        description: error?.message || error || "Failed to delete deck",
        variant: "destructive",
        duration: 2400,
      });
    }
    setIsWaiting(false);
    setOpenDialog(false);
  };

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 25);
  };

  const deleteCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index, side, value) => {
    const newCards = [...cards];
    newCards[index][side] = value;
    setCards(newCards);
  };

  const handleOpenDialog = (type) => {
    setDialogAction(type);
    setOpenDialog(true);
  };

  return (
    <>
      <div className="container mx-auto px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="md:flex justify-between items-center mb-8">
            <h1 className="md:text-3xl text-2xl md:mb-0 mb-2 font-bold [text-shadow:_0_3px_6px_rgb(18,18,24,0.25)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
              Edit Deck
            </h1>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => handleOpenDialog(0)} disabled={isWaiting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Deck
              </Button>
              <Button onClick={() => handleOpenDialog(1)} disabled={isWaiting}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
          <div className="mb-5">
            <FloatInput label="Deck Title" value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 mb-5 pl-2">
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public">Make deck public</Label>
          </div>
          
          <div className="lg:space-y-[36px] space-y-6 shadow-sm">
            {cards.map((card, index) => (
              <Card key={index} className="dark:border-[#232a33] shadow-[0_2px_7px_rgba(0,0,0,0.25)]">
                <div className="font-medium pt-3 pl-5 pr-4 text-[22px] flex items-center justify-between">
                  <span>Card {index + 1}</span>
                  <Button variant="ghost" size="icon" className="hover:bg-destructive hover:text-destructive-foreground" onClick={() => deleteCard(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 p-6 pt-5">
                  <FloatTextarea
                    label="Enter front side content"
                    value={card.front}
                    onChange={(e) => updateCard(index, "front", e.target.value)}
                    className="border-gray-300 dark:border-[#212533bb] pl-[15px] pt-[14px] text-lg md:h-[140px] h-[120px]"
                    maxLength={128}
                  />
                  <FloatTextarea
                    label="Enter back side content"
                    value={card.back}
                    onChange={(e) => updateCard(index, "back", e.target.value)}
                    className="border-gray-300 dark:border-[#212533bb] pl-[15px] pt-[14px] text-lg md:h-[140px] h-[120px]"
                    maxLength={128}
                  />
                </div>
              </Card>
            ))}
          </div>
        <div ref={bottomRef} style={{ scrollMarginBottom: "32px" }}>
          <Button onClick={addCard} className="border-[#c5cbd6] dark:border-[#222530] lg:mt-11 mt-8 w-full duration-200" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={(open) => { if(!isWaiting) setOpenDialog(open) }}>
        <DialogContent hideClose={isWaiting}>
          <DialogTitle>
            {dialogAction ? (
              <>
                <p className="md:text-3xl text-2xl font-medium md:mb-4 mb-[10px]">Save Changes</p>
                <p className="md:text-base text-sm font-normal text-muted-foreground">
                  Are you sure you want to save these changes?
                </p>
              </>
            ) : (
              <>
                <p className="md:text-3xl text-2xl font-medium text-destructive md:mb-4 mb-[10px]">Delete Deck</p>
                <p className="md:text-base text-sm font-normal text-muted-foreground">
                  Are you sure you want to delete this deck? This action cannot be undone.
                </p>
              </>
            )}
          </DialogTitle>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={isWaiting}>
              Cancel
            </Button>
            {dialogAction ? (
              <Button onClick={handleSave} disabled={isWaiting}>
                {isWaiting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-[6px]" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDeleteDeck} disabled={isWaiting}>
                {isWaiting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-[6px]" />
                    Deleting...
                  </>
                ) : "Delete Deck"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}