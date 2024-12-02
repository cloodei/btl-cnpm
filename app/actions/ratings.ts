"use server";
import sql from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function rateDeck({ deckId, userId, rating }: { deckId: number, userId: string, rating: number }) {
  "use server";
  try {
    await sql`
      INSERT INTO ratings (reviewer_id, deck_id, rating)
      VALUES (${userId}, ${deckId}, ${rating})
      ON CONFLICT (reviewer_id, deck_id) 
      DO UPDATE SET rating = ${rating}, updated_at = CURRENT_TIMESTAMP
    `;
    if(deckId === 9 || deckId === 11 || deckId === 12) {
      revalidateTag(`featured-deck-${deckId}`);
    }
    else {
      revalidateTag(`deck-${deckId}`);
    }
    revalidateTag('recent-decks');
    revalidateTag('decks');
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function getUserRating({ deckId, userId }: { deckId: number, userId: string }) {
  "use server";
  try {
    const [rating] = await sql`
      SELECT rating 
      FROM ratings
      WHERE deck_id = ${deckId} AND reviewer_id = ${userId}
    `;
    return { success: true, rating: rating?.rating || 0 };
  }
  catch(error) {
    return { success: false, error };
  }
}