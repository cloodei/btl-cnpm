"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addToFavorites, removeFromFavorites } from "@/app/actions/deck";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bookmark } from "lucide-react";

export default function FavoritesButton({ deckId, userId, is_favorite, size = "4", text = "", className = "" }) {
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
          duration: 2000,
        });
        setFavorite(!isFavorite);
      }
      else {
        toast({
          title: "Error",
          description: "Failed to update favorites",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
    catch(error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000,
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleFavorite}
      variant="outline"
      disabled={loading}
      size="icon"
      className={className}
    >
      {loading ? (
        <Loader2 className={`w-${size} h-${size} animate-spin`} />
      )
      : (
        <>
          <Bookmark className={`w-${size} h-${size} ${isFavorite ? "fill-current" : ""}`} />
          {text && <span>{text}</span>}
        </>
      )}
    </Button>
  );
}