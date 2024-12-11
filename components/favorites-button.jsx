"use client";
import { useState } from "react";
import { addToFavorites, removeFromFavorites } from "@/app/actions/deck";
import { useToast } from "@/hooks/use-toast";
import { HandHeart } from "lucide-react";
import { Card } from "./ui/card";

export default function FavoritesButton({ deckId, is_favorite, userId }) {
  const [isFavorite, setFavorite] = useState(is_favorite);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      const result = (isFavorite ? (await removeFromFavorites({ deckId, userId })) : (await addToFavorites({ deckId, userId })));
      if(result.success) {
        toast({
          title: "Success!",
          description: isFavorite ? "Removed from favorites" : "Added to favorites",
          duration: 2500,
        });
        setFavorite(!isFavorite);
      }
      else {
        toast({
          title: "Error",
          description: result.error?.message || result.error || "An error occurred",
          variant: "destructive",
          duration: 2500,
        });
      }
    }
    catch(error) {
      toast({
        title: "Error",
        description: error?.message || error || "An error occurred",
        variant: "destructive",
        duration: 2500,
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`
        flex flex-col items-center gap-2 rounded-[7px] p-[10px] md:p-3 shadow-[0_2px_4px_rgba(0,0,0,0.35)] 
        ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "transition-all duration-200 hover:bg-secondary cursor-pointer"}
      `}
      onClick={() => { if(!loading) handleToggleFavorite() }}
    >
      <HandHeart className={`h-8 md:h-9 w-8 md:w-9 ${isFavorite ? "text-rose-500" : "text-primary"}`} />
      <p className="text-xs md:text-sm text-primary">
        {isFavorite ? "Deck Saved" : "Save Deck"}
      </p>
    </Card>
  );
}