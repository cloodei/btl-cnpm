'use server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateDecks() {
  "use server";
  revalidateTag('decks');
}

export async function revalidateDeckByPath(path: string) {
  "use server";
  revalidatePath(path);
}

export async function createDeck({ title, cards, isPublic }: { title: string, cards: { front: string, back: string }[], isPublic: boolean }) {
  "use server";
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
    await sql`
      INSERT INTO cards(deck_id, front, back)
      SELECT ${deck.id}, front, back
      FROM json_to_recordset(${JSON.stringify(cards)})
      AS cards(front varchar, back varchar)
    `;
    revalidateTag('decks');
    revalidateTag(`deck-${deck.id}`);
    if(isPublic) {
      revalidateTag('recent-decks');
    }
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
        SELECT d.id, d.name, d.public, d.total_rating, d.count_ratings, d.created_at, d.updated_at, COUNT(c.id) AS totalcards
        FROM decks AS d
        LEFT JOIN cards AS c
        ON d.id = c.deck_id
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

export const getRecentDecksWithCardsCount = unstable_cache(async () => {
    try {
      const decks = await sql`
        SELECT d.*, COUNT(c.id) AS totalcards, u.username
        FROM decks AS d
        INNER JOIN users AS u
        ON d.creator_id = u.id
        LEFT JOIN cards AS c
        ON d.id = c.deck_id
        WHERE d.public = true
        AND u.id != 'user_2pARGljiy1lvZFgeFNCWGeN5JWG'
        GROUP BY d.id, u.username, u.id
        ORDER BY d.created_at DESC
      `;
      return { success: true, decks };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ["get-recent-decks"], { tags: ['recent-decks'], revalidate: 90 }
);

export const getFeaturedDecksWithCardsCount = unstable_cache(async (userId: string = "user_2pARGljiy1lvZFgeFNCWGeN5JWG") => {
    try {
      const decks = await sql`
        SELECT d.id, d.name, d.public, d.total_rating, d.count_ratings, d.created_at, d.updated_at, COUNT(c.id) AS totalcards
        FROM decks AS d
        LEFT JOIN cards AS c
        ON d.id = c.deck_id
        WHERE d.creator_id = ${userId}
        AND d.public = true
        GROUP BY d.id
        ORDER BY d.created_at DESC
        LIMIT 3
      `;
      return { success: true, decks };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ["get-featured-decks"], { tags: ['featured-decks'], revalidate: 600 }
);

export async function getDeck(deckId: number) {
  try {
    const [deck] = await sql`
      SELECT d.id, d.creator_id, d.name, d.total_rating, d.count_ratings, d.public, d.created_at, d.updated_at, u.username
      FROM decks AS d
      INNER JOIN users AS u
      ON d.creator_id = u.id
      WHERE d.id = ${deckId}
    `;
    if(!deck) {
      return { success: false, error: 'Deck not found' };
    }
    const cards = await sql`
      SELECT id, front, back
      FROM cards
      WHERE deck_id = ${deckId}
    `;
    return { success: true, deck, cards };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function getCachedDeck(deckId: number) {
  if(isNaN(deckId) || !deckId) {
    return { success: false, error: 'Invalid deck ID' };
  }
  return unstable_cache(async () => {
      const [deck, cards] = await Promise.all([
        sql`
          SELECT d.id, d.creator_id, d.name, d.total_rating, d.count_ratings, d.public, d.created_at, d.updated_at, u.username
          FROM decks AS d
          INNER JOIN users AS u
          ON d.creator_id = u.id
          WHERE d.id = ${deckId}
        `,
        sql`
          SELECT id, front, back
          FROM cards
          WHERE deck_id = ${deckId}
        `
      ]);
      return { success: true, deck: deck[0], cards };
    }, [`deck-${deckId}`], { tags: [`deck-${deckId}`], revalidate: 60 }
  )();
}

export async function getFeaturedDeck(deckId: number) {
  return unstable_cache(async () => {
      const [deck, cards] = await Promise.all([
        sql`
          SELECT d.id, d.creator_id, d.name, d.total_rating, d.count_ratings, d.public, d.created_at, d.updated_at, u.username
          FROM decks AS d
          INNER JOIN users AS u
          ON d.creator_id = u.id
          WHERE d.id = ${deckId}
        `,
        sql`
          SELECT id, front, back
          FROM cards
          WHERE deck_id = ${deckId}
        `
      ]);
      return { success: true, deck: deck[0], cards };
    }, [`get-featured-deck-${deckId}`], { tags: [`featured-deck-${deckId}`], revalidate: 900 }
  )();
}

export async function updateDeck({ deckId, title, cards, isPublic }: { deckId: number, title: string, cards: { front: string, back: string }[], isPublic: boolean }) {
  try {
    if(!deckId) {
      return { success: false, error: 'Deck ID is required' };
    }
    await Promise.all([
      sql`
        UPDATE decks
        SET name = ${title}, public = ${isPublic}, updated_at = ${new Date().toISOString()}
        WHERE id = ${deckId}
      `,
      sql`
        DELETE FROM cards
        WHERE deck_id = ${deckId}
      `,
      sql`
        INSERT INTO cards(deck_id, front, back)
        SELECT ${deckId}, front, back
        FROM json_to_recordset(${JSON.stringify(cards)})
        AS cards(front varchar, back varchar)
      `
    ]);
    revalidateTag('decks');
    revalidateTag(`deck-${deckId}`);
    revalidateTag('recent-decks');
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function handleDelete(deckId: number) {
  "use server";
  try {
    await sql`
      DELETE FROM decks
      WHERE id = ${deckId}
    `;
    revalidateTag('decks');
    revalidateTag(`deck-${deckId}`);
    revalidateTag('recent-decks');
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
    revalidateTag(`deck-${deckId}`);
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}