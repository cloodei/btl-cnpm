"use server";
import { sql } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function addToFavorites({ deckId, userId }: { deckId: number, userId: string }) {
  try {
    await sql`
      INSERT INTO favorite_decks(deck_id, viewer_id)
      VALUES (${deckId}, ${userId})
    `;
    revalidateTag('favorites');
    revalidateTag('user-info-decks');
    revalidateTag(`deck-${deckId}`);

    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function removeFromFavorites({ deckId, userId }: { deckId: number, userId: string }) {
  try {
    await sql`
      DELETE FROM favorite_decks
      WHERE deck_id = ${deckId}
      AND viewer_id = ${userId}
    `;
    revalidateTag('favorites');
    revalidateTag('user-info-decks');
    revalidateTag(`deck-${deckId}`);
    
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}