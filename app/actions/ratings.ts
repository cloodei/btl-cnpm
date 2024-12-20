"use server";
import { sql } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function rateDeck({ deckId, userId, rating }: { deckId: number, userId: string, rating: number }) {
  await sql`
    INSERT INTO ratings (reviewer_id, deck_id, rating)
    VALUES (${userId}, ${deckId}, ${rating})
    ON CONFLICT (reviewer_id, deck_id) 
    DO UPDATE SET rating = ${rating}, updated_at = CURRENT_TIMESTAMP
  `;
  revalidateTag(`deck-${deckId}`);
  revalidateTag('recent-decks');
  revalidateTag('decks');
}

export async function getUserRating({ deckId, userId }: { deckId: number, userId: string }) {
  try {
    const [{ rating }] = await sql`
      SELECT rating 
      FROM ratings
      WHERE deck_id = ${deckId} AND reviewer_id = ${userId}
    `;
    const ratingValue = rating ? parseInt(rating) : 0;
    return { success: true, rating: ratingValue };
  }
  catch(error) {
    return { success: false, error };
  }
}