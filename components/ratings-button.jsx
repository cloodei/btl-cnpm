"use client";
import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rateDeck, getUserRating } from "@/app/actions/ratings";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";

export default function RatingButton({ deckId, userId, avgRating = 0 }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: userRatingData, isLoading } = useQuery({
    queryKey: ['rating', deckId, userId],
    queryFn: () => getUserRating({ deckId, userId }),
    staleTime: 60000
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (rating) => rateDeck({ deckId, userId, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', deckId, userId] });
      toast({
        title: "Success",
        description: `Rating has been updated to ${selectedRating}`,
        duration: 2500
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: err?.message || err || "Failed to update rating",
        duration: 2500
      });
    }
  });

  const handleRating = (rating) => {
    if(isLoading) {
      return;
    }
    mutate(rating);
    setSelectedRating(rating);
    setIsOpen(false);
  }

  const userRating = (userRatingData?.success ? userRatingData.rating : 0);
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Card
          className={`flex flex-col items-center gap-2 rounded-[7px] p-[10px] md:p-3 shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${(isLoading || isPending) ? "opacity-50 cursor-not-allowed pointer-events-none" : "transition-all duration-200 hover:bg-secondary cursor-pointer"}`}
          onClick={() => { if(!isLoading && !isPending) setIsOpen(!isOpen) }}
        >
          {(isLoading || isPending)
            ? <Loader2 className="h-8 md:h-9 w-8 md:w-9 animate-spin text-primary" />
            : <Star className={`h-8 md:h-9 w-8 md:w-9 ${userRating > 0 ? "text-amber-400" : "text-primary"}`} />
          }
          <p className="text-xs md:text-sm text-primary">
            {userRating > 0 ? "Change Rating" : "Rate Deck"}
          </p>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] p-2" onMouseLeave={() => setHoverRating(0)}>
        <div className="flex items-center gap-1 mb-1 relative">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9 ,10].map((i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className={`p-0 h-8 w-8 ${(hoverRating >= i || userRating >= i) ? 'text-yellow-400' : 'text-muted-foreground'}`}
              onMouseEnter={() => setHoverRating(i)}
              onClick={() => handleRating(i)}
            >
              <Star className={`h-4 w-4 ${(hoverRating >= i || userRating >= i) && 'fill-current'}`} />
            </Button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground text-center pt-1 border-t">
          Rating: {avgRating.toFixed(1)} / 10 - {userRating > 0 ? `Your rating: ${userRating}` : "You haven't rated yet"}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}