"use server";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export async function createDeck({ title, cards, isPublic }: { title: string, cards: { front: string, back: string }[], isPublic: boolean }) {
  try {
    const { userId } = await auth();
    if(!userId) {
      return { success: false, error: 'You must be logged in to create a deck' };
    }
    const [deck] = await sql`
      INSERT INTO decks(creator_id, name, public)
      VALUES (${userId}, ${title}, ${isPublic})
      RETURNING id
    `;
    let query = "INSERT INTO cards(deck_id, front, back) VALUES ";
    let queryParams = new Array(cards.length * 3);
    for(let i = 0; i < cards.length; i++) {
      const j = i * 3;
      query += `($${j + 1}, $${j + 2}, $${j + 3}), `;
      queryParams[j] = deck.id;
      queryParams[j + 1] = cards[i].front;
      queryParams[j + 2] = cards[i].back;
    }

    await sql(query.slice(0, -2), queryParams);

    revalidateTag('decks');
    revalidateTag(`deck-${deck.id}`);
    revalidateTag('user-info-decks');
    if(isPublic) {
      revalidateTag('recent-decks');
    }
    
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function updateDeck({ deckId, title, cards, isPublic }: { deckId: number, title: string, cards: { deck_id: number, front: string, back: string }[], isPublic: boolean }) {
  try {
    if(!deckId) {
      return { success: false, error: 'Deck ID is required' };
    }
    let query = "INSERT INTO cards(deck_id, front, back) VALUES ";
    let queryParams = new Array(cards.length * 3);
    for(let i = 0; i < cards.length; i++) {
      const j = i * 3;
      query += `($${j + 1}, $${j + 2}, $${j + 3}), `;
      queryParams[j] = deckId;
      queryParams[j + 1] = cards[i].front;
      queryParams[j + 2] = cards[i].back;
    }
    await Promise.all([
      sql`
        UPDATE decks
        SET name = ${title}, public = ${isPublic}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${deckId}
      `,
      sql`
        DELETE FROM cards
        WHERE deck_id = ${deckId}
      `,
    ]);
    
    await sql(query.slice(0, -2), queryParams)

    revalidateTag('decks')
    revalidateTag(`deck-${deckId}`)
    revalidateTag('recent-decks')
    revalidateTag('user-info-decks')

    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function deleteDeck(deckId: number) {
  try {
    await sql`DELETE FROM decks WHERE id = ${deckId}`;
    revalidateTag('decks');
    revalidateTag(`deck-${deckId}`);
    revalidateTag('recent-decks');
    revalidateTag('user-info-decks');

    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}