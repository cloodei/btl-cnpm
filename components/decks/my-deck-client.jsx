"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Loader2, Edit, Trash2, MoreVertical, Plus, BookOpen, Send, MessageCircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { deleteDeck } from "@/app/actions/deck";
import { useRouter } from "next/navigation";
import { getTimeIndicator } from "@/lib/utils";

export default function MyDecksClient({ decks }) {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, deckId: null, deckName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  for(let i = 0; i != decks.length; i++) {
    router.prefetch(`/decks/${decks[i].id}`);
  }

  const handleDeleteDeck = async () => {
    setIsDeleting(true);
    const { success, error } = await deleteDeck(deleteDialog.deckId);
    if(!success) {
      toast({
        title: "Error",
        description: error?.message || error || "Failed to delete deck",
        variant: "destructive",
        duration: 2400,
      });
    }
    else {
      toast({
        title: "Success",
        description: `Deck '${deleteDialog.deckName}' has been deleted successfully`,
        duration: 2400,
      });
    }
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, deckId: null, deckName: "" });
    router.refresh();
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 24, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
  <>
    <div className="max-w-7xl mx-auto py-8 px-7 min-h-[calc(100vh-48px)]">
      <div className="lg:flex lg:justify-between lg:items-center md:flex md:justify-between md:items-center lg:mb-8 md:mb-6 mb-4 md:px-8 px-5">
        <div className="mb-4">
          <h1 className="lg:text-4xl text-[28px] font-bold mb-2 [text-shadow:_0_1px_4px_rgb(18,18,24,0.22)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
            My Decks
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage and study your personal collection of flashcard decks
          </p>
        </div>
        <Button
          className="lg:px-4 pr-3 pl-2 lg:py-2 py-[4px] lg:text-base text-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            router.push("/create");
          }}
        >
          <Plus className="lg:mr-2 mr-1 h-4 w-4" />
          Create New Deck
        </Button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <motion.div key={deck.id} variants={item}>
            <Card className="relative transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.22)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)] hover:scale-[1.02] dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.24)]">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onMouseDown={(e) => {
                      e.preventDefault();
                      router.push(`/decks/${deck.id}/edit`);
                    }}>
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Deck
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog({ isOpen: true, deckId: deck.id, deckName: deck.name })}>
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Deck
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className="p-6 cursor-pointer"
                title={deck.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  router.push(`/decks/${deck.id}`);
                }}
              >
                <h3 className="text-xl font-semibold mb-2 pr-12 truncate">{deck.name}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cards</span>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {deck.totalcards}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Public
                    </span>
                    <span className="flex items-center">
                      {deck.public
                        ? <Send className="h-5 w-5 mr-1 text-sky-900 dark:text-sky-300/85" />
                        : <MessageCircleOff className="h-5 w-5 mr-1 text-rose-900 dark:text-rose-300" />
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated </span>
                    <span> {getTimeIndicator(deck.updated_at)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
      
    <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => { if(!isDeleting) setDeleteDialog({ isOpen: open, deckId: deleteDialog.deckId, deckName: deleteDialog.deckName }) }}>
      <DialogContent className="sm:max-w-[425px]" hideClose={isDeleting}>
        <DialogHeader className="truncate">
          <DialogTitle className="text-xl font-semibold">Delete Deck</DialogTitle>
          <DialogDescription className="pt-3" title={deleteDialog.deckName}>
            Are you sure you want to delete <span className="font-medium text-foreground">{deleteDialog.deckName}</span> ?
          </DialogDescription>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, deckId: null, deckName: "" })} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteDeck} className="gap-2" disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Deck"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}