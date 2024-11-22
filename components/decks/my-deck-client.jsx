"use client";

import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Loader2, Edit, Trash2, MoreVertical, Plus, BookOpen, Sparkle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { handleDelete, revalidateDeckByPath, revalidateDecks } from "@/app/actions/deck";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function MyDecksClient({ decks }) {
  if(!decks || decks?.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "calc(90vh - 48px)" }}>
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-4">No decks found</h2>
          <p className="text-muted-foreground mb-3">You haven't created any flashcard decks yet.</p>
          <Link href="/create" className="w-full">
            <Button className="border-gray-400 dark:border-[#3c4152] w-full hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
              <Plus className="border-gray-300 dark:border-[#282e41] mr-2 h-4 w-4" />
              Add Card
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, deckId: null, deckName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { userId } = useAuth();

  const handleDeleteDeck = async () => {
    setIsDeleting(true);
    try {
      const result = await handleDelete({ deckId: deleteDialog.deckId, userId });
      if(result.success) {
        await revalidateDeckByPath("/my-decks");
        await revalidateDecks();
        router.refresh();
        toast({
          title: "Success",
          description: "Deck deleted successfully",
          duration: 2400,
        });
      }
      else {
        toast({
          title: "Error",
          description: "Failed to delete deck",
          variant: "destructive",
          duration: 2400,
        });
      }
    }
    catch(error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2400,
      });
    }
    finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, deckId: null, deckName: "" });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
  <>
    <div className="bg-gradient-to-b from-background to-secondary/20 pt-8 px-4" style={{ minHeight: "calc(100vh - 48px)" }}>
      <div className="max-w-6xl mx-auto lg:pb-8 md:pb-7 pb-6">
        <div className="lg:flex lg:justify-between lg:items-center md:flex md:justify-between md:items-center lg:mb-8 md:mb-6 mb-4">
          <div className="mb-4">
            <h1 className="lg:text-4xl text-[28px] font-bold mb-2">My Flashcard Decks</h1>
            <p className="text-muted-foreground text-sm">
              Manage and study your personal collection of flashcard decks
            </p>
          </div>
          <Link href="/create">
            <Button className="lg:px-4 pr-3 pl-2 lg:py-2 py-[4px] lg:text-base text-sm">
              <Plus className="lg:mr-2 mr-1 h-4 w-4" />
              Create New Deck
            </Button>
          </Link>
        </div>

        {decks.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: "calc(90vh - 48px)" }}>
            <div className="text-center">
              <h2 className="text-4xl font-semibold mb-4">No decks found</h2>
              <p className="text-muted-foreground mb-3">You haven't created any flashcard decks yet.</p>
              <Link href="/create" className="w-full">
                <Button className="border-gray-400 dark:border-[#3c4152] w-full hover:bg-[#ced4e0] dark:hover:bg-gray-800 duration-200" variant="outline">
                  <Plus className="border-gray-300 dark:border-[#282e41] mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </Link>
            </div>
          </div>
        ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {decks.map((deck) => (
            <motion.div key={deck.id} variants={item}>
              <Card className="relative group transition-all duration-200 hover:shadow-[0_16px_36px_rgba(0,0,0,0.21)] hover:scale-[1.02] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.17)]">
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Deck
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog({ isOpen: true, deckId: deck.id, deckName: deck.name })}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Deck
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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
                        <span className="text-muted-foreground">Ratings</span>
                        <div className="flex items-center gap-[6px]">
                          {deck.count_ratings > 0 ? (
                            <>
                              <span>{(1.0 * deck.total_rating / deck.count_ratings).toFixed(1)}</span>
                              <Sparkle />
                            </>
                          ) : (
                            <>
                              <Loader />
                              <span className="text-muted-foreground">None</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created At</span>
                        <span>{new Date(deck.created_at).toLocaleDateString('zh-CN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        )}
      </div>
    </div>
      
    <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !isDeleting && setDeleteDialog({ isOpen: open, deckId: null, deckName: "" })}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Delete Deck</DialogTitle>
          <DialogDescription className="pt-3">
            Are you sure you want to delete <span className="font-medium text-foreground">{deleteDialog.deckName}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, deckId: null, deckName: "" })} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteDeck} disabled={isDeleting} className="gap-2">
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}