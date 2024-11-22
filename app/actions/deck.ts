'use server';
import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function revalidateDecks() {
  "use server";
  revalidateTag('decks');
}

export async function revalidateDeckByPath(path: string) {
  "use server";
  revalidatePath(path);
}

export async function createDeck(title: string, cards: { front: string, back: string }[]) {
  "use server";
  try {
    const { userId } = await auth();
    if(!userId) {
      return { success: false, error: 'You must be logged in to create a deck' };
    }
    const [deck] = await sql`
      INSERT INTO decks (creator_id, name)
      VALUES (${userId}, ${title})
      RETURNING id
    `;
    await sql`
      INSERT INTO cards (deck_id, front, back)
      SELECT ${deck.id}, front, back
      FROM json_to_recordset(${JSON.stringify(cards)})
      AS cards(front varchar, back varchar)
    `;
    revalidateTag('decks');
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function getDecks(userId: string) {
  "use server";
  try {
    const decks = await sql`
      SELECT id, name
      FROM decks
      WHERE creator_id = ${userId}
    `;
    return { success: true, decks };
  }
  catch(error) {
    return { success: false, error };
  }
}

export const getCachedDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await sql`
        SELECT d.id, d.name, d.public, d.total_rating, d.count_ratings, d.created_at, d.updated_at, COUNT(c.id) AS totalCards
        FROM decks AS d
        LEFT JOIN cards AS c ON d.id = c.deck_id
        WHERE d.creator_id = ${userId}
        GROUP BY d.id
        ORDER BY d.created_at DESC
      `;
      return { success: true, decks };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ["get-decks"], { tags: ['decks'], revalidate: 120 }
);

export async function getDeck(deckId: number, userId: string) {
  try {
    const [deck] = await sql`
      SELECT id, name, total_rating, count_ratings, created_at, updated_at
      FROM decks
      WHERE creator_id = ${userId} AND id = ${deckId}
    `;
    if(!deck) {
      return { success: false, error: 'Deck not found' };
    }
    const cards = await sql`
      SELECT id, front, back
      FROM cards
      WHERE deck_id = ${deckId}
    `;
    if(!cards.length) {
      return { success: false, error: 'Deck has no cards' };
    }
    return { success: true, deck, cards };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function updateDeckTitle({ deckId, title, cards, userId }: { deckId: number, title: string, cards: { front: string, back: string }[], userId: string }) {
  try {
    const [deck] = await sql`
      UPDATE decks
      SET name = ${title}
      WHERE creator_id = ${userId} AND id = ${deckId}
      RETURNING id
    `;
    if(!deck) {
      return { success: false, error: 'Deck not found' };
    }
    await sql`
      DELETE FROM cards
      WHERE deck_id = ${deckId}
    `;
    await sql`
      INSERT INTO cards (deck_id, front, back)
      SELECT ${deckId}, front, back
      FROM json_to_recordset(${JSON.stringify(cards)})
      AS cards(front varchar, back varchar)
    `;
    revalidateTag('decks');
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function handleDelete({ deckId, userId }: { deckId: number, userId: string }) {
  "use server";
  try {
    await sql`
      DELETE FROM decks
      WHERE creator_id = ${userId} AND id = ${deckId}
    `;
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function rateDeck({ deckId, rating, userId }: { deckId: number, rating: number, userId: string }) {
  try {
    await sql`
      INSERT INTO ratings (deck_id, user_id, rating)
      VALUES (${deckId}, ${userId}, ${rating})
      ON CONFLICT (deck_id, user_id)
      DO UPDATE SET rating = ${rating}
    `;
    revalidateTag('decks');
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}