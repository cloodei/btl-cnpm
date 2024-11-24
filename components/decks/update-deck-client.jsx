"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { FloatInput } from "@/components/ui/float-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2, X, Loader2 } from "lucide-react";
import { updateDeck, handleDelete } from "@/app/actions/deck";
import { useToast } from "@/hooks/use-toast";

export default function UpdateDeckComponent({ deck, cards: initialCards }) {
  const [cards, setCards] = useState(initialCards);
  const [deckTitle, setDeckTitle] = useState(deck.name);
  const [isPublic, setIsPublic] = useState(deck.public);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const bottomRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async () => {
    if(!deckTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a deck title",
        variant: "destructive",
        duration: 2400,
      });
      setSaveDialog(false);
      return;
    }
    if(deckTitle.length > 64) {
      toast({
        title: "Error",
        description: "Deck title must be 64 characters or less",
        variant: "destructive",
        duration: 2400,
      });
      setSaveDialog(false);
      return;
    }
    const validCards = cards.filter(card => card.front.trim() && card.back.trim());
    if(!validCards.length) {
      toast({
        title: "Error",
        description: "Please add at least one complete card",
        variant: "destructive",
        duration: 2400,
      });
      setSaveDialog(false);
      return;
    }
    setIsSaving(true);
    try {
      const result = await updateDeck({ deckId: deck.id, title: deckTitle, cards: validCards, isPublic });
      if(result.success) {
        toast({
          title: "Success!",
          description: "Deck updated successfully",
          duration: 2400,
        });
        router.push('/my-decks');
      }
      else {
        toast({
          title: "Error",
          description: (result.error.message ? result.error.message : (result.error ? result.error : "Failed to update deck")),
          variant: "destructive",
          duration: 2400,
        });
      }
    }
    catch(error) {
      toast({
        title: "Error",
        description: (error.message ? error.message : (error ? error : "An error occurred")),
        variant: "destructive",
      });
    }
    finally {
      setIsSaving(false);
      setSaveDialog(false);
    }
  };

  const handleDeleteDeck = async () => {
    setIsDeleting(true);
    try {
      const result = await handleDelete(deck.id);
      if(result.success) {
        toast({ title: "Success", description: "Deck deleted successfully" });
        router.push('/my-decks');
      }
      else {
        toast({
          title: "Error",
          description: "Failed to delete deck",
          variant: "destructive",
        });
      }
    }
    catch(error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
    finally {
      setIsDeleting(false);
      setDeleteDialog(false);
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
          <div className="md:flex justify-between items-center mb-8">
            <h1 className="md:text-3xl text-2xl md:mb-0 mb-2 font-bold">Edit Deck</h1>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Deck
              </Button>
              <Button onClick={() => setSaveDialog(true)}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <FloatInput
              label="Deck Title"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
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
                  <Button variant="ghost" size="icon" className="hover:bg-destructive hover:text-destructive-foreground" onClick={() => deleteCard(index)}>
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

      <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
        <DialogContent>
          <DialogTitle>
            <p className="md:text-3xl text-2xl font-medium md:mb-4 mb-[10px]">Save Changes</p>
            <p className="md:text-base text-sm font-normal text-muted-foreground">
              Are you sure you want to save these changes?
            </p>
          </DialogTitle>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setSaveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogTitle>
            <p className="md:text-3xl text-2xl font-medium text-destructive md:mb-4 mb-[10px]">Delete Deck</p>
            <p className="md:text-base text-sm font-normal text-muted-foreground">
              Are you sure you want to delete this deck? This action cannot be undone.
            </p>
          </DialogTitle>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteDeck}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete Deck"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}