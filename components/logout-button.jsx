'use client';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useState } from 'react';
import { revalidateUser } from '@/app/actions/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogoutButton({ className = "", variant = "outline", size = "default", children = "Log out" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useClerk();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      await revalidateUser();
      router.push('/');
      toast({ title: "Successfully logged out", description: "See you next time! 👋", duration: 2500 });
    }
    catch(error) {
      toast({ title: "Error logging out", description: "Please try again", variant: "destructive", duration: 2500 });
    }
    finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant={variant} size={size} className={`group ${className}`}>
        <LogOut className="w-4 h-4 md:mr-2 transition-transform group-hover:rotate-12" />
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
                  Ready to leave?
                </DialogTitle>
                <p className="text-muted-foreground mt-4">
                  Your progress is saved. You can continue where you left off next time.
                </p>
              </DialogHeader>

              <DialogFooter className="mt-6 gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="hover:bg-secondary/80">
                  Stay
                </Button>
                <Button variant="destructive" onClick={handleSignOut} disabled={isLoading} className="gap-2">
                  {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Logging out..." : "Yes, log me out"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </>
  );
}