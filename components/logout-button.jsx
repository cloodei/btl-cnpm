"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftFromLine, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export default function LogoutButton({
  className = "",
  variant = "expandIconDestructive",
  size = "default",
  text = "Log out"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useClerk();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      window?.__unstable__onBeforeSetActive = null;
      await signOut();
    }
    catch(error) {
      toast({
        title: "Error logging out",
        description: error?.message || error || "Something went wrong",
        variant: "destructive",
        duration: 2500
      });
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        Icon={ArrowLeftFromLine}
        iconPlacement="left"
        size={size}
        onClick={() => setIsOpen(true)}
        className={cn("transition-all hover:gap-2", className)}
      >
        {text}
      </Button>

      <AnimatePresence>
        <Dialog open={isOpen} onOpenChange={(open) => { if(!isLoading) setIsOpen(open) }}>
          <DialogContent className="sm:max-w-[425px]" hideClose={isLoading}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold leading-none tracking-tight">
                  Ready to leave?
                </DialogTitle>
                <p className="text-muted-foreground mt-4">
                  Your progress is saved. You can continue where you left off next time.
                </p>
              </DialogHeader>

              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="hover:bg-secondary/80" disabled={isLoading}>
                  Stay
                </Button>
                <Button variant="destructive" onClick={handleSignOut} disabled={isLoading} className="gap-[6px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    "Yes, log me out"
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </>
  );
}