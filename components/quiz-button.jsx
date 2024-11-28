"use client";
import { useState } from "react";
import { CirclePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function QuizButton({ deckId, variant = "outline", size = "default", className = "", children = "Start Quiz" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant={variant} size={size} className={`group ${className}`}>
        <CirclePlay className="w-4 h-4 md:mr-2 transition-transform group-hover:rotate-12" />
        <span className='md:inline-block hidden'>
          {children}
        </span>
      </Button>

      <AnimatePresence>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold leading-none tracking-tight">
                  Begin Test
                </DialogTitle>
                <p className="text-muted-foreground mt-4">
                  Start testing your knowledge with this deck.
                </p>
              </DialogHeader>

              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="hover:bg-secondary/80">
                  Cancel
                </Button>
                <Link href={`/decks/${deckId}/quiz`}>
                  <Button variant="default">
                    <CirclePlay className="h-6 w-6 mr-[5px]" />
                    Start Quiz
                  </Button>
                </Link>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </>
  );
}