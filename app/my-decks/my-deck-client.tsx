"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { deleteDeck } from "@/app/actions/deck-mutations";
import { getTimeIndicator } from "@/lib/utils";
import { Loader2, Edit, Trash2, MoreVertical, BookOpen, Send, MessageCircleOff, SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatInput } from "@/components/ui/float-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const container = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: {
    y: 24,
    opacity: 0
  },
  show: {
    y: 0,
    opacity: 1
  }
};

type MyDecksClientProps = {
  decks: {
    id: number;
    name: string;
    public: boolean;
    created_at: Date;
    updated_at: Date;
    totalcards: number;
  }[];
};

export default function MyDecksClient({ decks }: MyDecksClientProps) {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, deckId: 0, deckName: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pub = searchParams.get("pub") || "a";
  
  const q = query ? query.toLowerCase() : "";
  const filteredDecks = decks.filter((deck) => {
    const pubCheck = (pub === "a" || (pub === "t" && deck.public) || (pub === "f" && !deck.public));
    if(!q) {
      return pubCheck;
    }
    return deck.name.toLowerCase().includes(q) && pubCheck;
  });
  
  const handleInputBlur = (value: string) => {
    const newQuery = value.trim() || undefined;
    updateFilters(newQuery, pub);
  };

  const updateFilters = (newQuery: string | undefined, newPublic: string) => {
    const params = new URLSearchParams(searchParams);
    if(newQuery) {
      params.set("q", newQuery);
    }
    else {
      params.delete("q");
    }
    if(newPublic !== "a") {
      params.set("pub", newPublic);
    }
    else {
      params.delete("pub");
    }
    router.push(`/my-decks?${params.toString()}`, { scroll: false });
  };

  const handleDeleteDeck = async () => {
    setIsDeleting(true);
    const { success, error } = await deleteDeck(deleteDialog.deckId);
    if(success) {
      toast({
        title: "Success",
        description: `Deck '${deleteDialog.deckName}' has been deleted successfully`,
        duration: 2500
      });
    }
    else {
      const err = error as any;
      toast({
        title: "Error",
        description: err?.message || err || "Failed to delete deck",
        variant: "destructive",
        duration: 2500
      });
    }
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, deckId: 0, deckName: "" });
    router.refresh();
  };

  return (
  <>
    <div className="max-w-7xl mx-auto py-8 px-7 min-h-[calc(100vh-48px)]">
      <header className="md:flex md:justify-between md:items-center md:gap-2 md:mb-6 mb-4 px-3">
        <div className="mb-6">
          <h1 className="lg:text-4xl text-[28px] font-bold mb-[3px] sm:mb-2 [text-shadow:_0_1px_4px_rgb(18,18,24,0.22)] dark:[text-shadow:_0_1px_8px_rgb(145_164_203_/_0.6)]">
            My Decks
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Manage and study your personal collection of flashcard decks
          </p>
        </div>

        <motion.div initial={item.hidden} animate={item.show} className="flex items-center gap-3 pb-2">
          <FloatInput 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={(e) => handleInputBlur(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInputBlur(searchQuery)}
            label="Search Decks..."
            className="w-40 sm:w-[184px] border-gray-300 dark:border-[rgba(35,40,46,0.75)] py-2 pr-2 max-sm:text-sm"
            labelClassname="text-xs"
          />

          <Select defaultValue={pub} onValueChange={(value) => updateFilters(query, value)}>
            <SelectTrigger className="w-28 sm:w-32 text-xs sm:text-sm sm:h-10 border-gray-300 dark:border-[rgba(35,40,46,0.75)]">
              <SelectValue placeholder="Filter by public" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">All</SelectItem>
              <SelectItem value="t">Public Only</SelectItem>
              <SelectItem value="f">Private Only</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map((deck) => (
          <motion.div key={deck.id} variants={item}>
            <Card
              className="relative transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.22)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)] hover:scale-[1.02] dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.24)]"
              onMouseEnter={() => {
                router.prefetch(`/decks/${deck.id}`);
                router.prefetch(`/decks/${deck.id}/edit`);
              }}
            >
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

      {!filteredDecks.length && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center gap-2 w-fit mx-auto max-sm:text-sm font-medium text-muted-foreground sm:border border-gray-300 dark:border-[rgba(46,47,49,0.8)] md:py-[10px] md:pl-[25px] md:pr-[21px] rounded-lg">
            No decks match "{query}"{(pub !== "a") && (pub === "t" ? " and is Public Only" : " and is Private Only")}
            <SearchX className="h-[21px] w-[21px]" />
          </div>
        </div>
      )}
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
          <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, deckId: 0, deckName: "" })} disabled={isDeleting}>
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