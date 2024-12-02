"use client";
import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rateDeck, getUserRating } from "@/app/actions/ratings";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function RatingButton({ deckId, userId, avgRating = 0 }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userRatingData, isFetching } = useQuery({
    queryKey: ['rating', deckId, userId],
    queryFn: () => getUserRating({ deckId, userId }),
    staleTime: 30000
  });

  const { mutate, isLoading } = useMutation({
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
    if(isFetching) {
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
        <Button variant="outline" size="icon" disabled={(isFetching || isLoading)} className={`${userRating > 0 ? "text-yellow-400" : ""} relative`}>
          {(isFetching || isLoading) ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Star className={`h-5 w-5 ${userRating > 0 ? "fill-current" : ""}`} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] p-2" onMouseLeave={() => setHoverRating(0)}>
        <div className="flex items-center gap-1 mb-1 relative">
          {(isFetching || isLoading) && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {[...Array(10)].map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              disabled={isFetching}
              className={`p-0 h-8 w-8 ${(hoverRating >= i + 1 || userRating >= i + 1) ? 'text-yellow-400' : 'text-muted-foreground'}`}
              onMouseEnter={() => setHoverRating(i + 1)}
              onClick={() => handleRating(i + 1)}
            >
              <Star className={`h-4 w-4 ${(hoverRating >= i + 1 || userRating >= i + 1) ? 'fill-current' : ''}`} />
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