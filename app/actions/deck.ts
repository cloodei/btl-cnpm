'use server';
import sql from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateDecks() {
  "use server";
  revalidateTag('decks');
  revalidateTag('recent-decks');
  revalidateTag('favorites');
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
    if(isPublic) {
      revalidateTag('recent-decks');
    }
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export const getCachedDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await sql`
        SELECT d.id, d.name, d.public, d.created_at, d.updated_at, COUNT(c.id) AS totalcards
        FROM decks AS d
        LEFT JOIN cards AS c ON d.id = c.deck_id
        WHERE d.creator_id = ${userId}
        GROUP BY d.id
      `;
      return { success: true, decks };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ["get-decks"], { tags: ['decks'], revalidate: 120 }
);

export const getFavoriteDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await sql`
        SELECT d.id, d.name, f.created_at, COUNT(c.id) AS totalcards, u.username
        FROM decks AS d
        INNER JOIN favorite_decks AS f ON d.id = f.deck_id
        INNER JOIN users AS u ON d.creator_id = u.id
        LEFT JOIN cards AS c ON d.id = c.deck_id
        WHERE f.viewer_id = ${userId}
        GROUP BY d.id, f.created_at, u.username
        ORDER BY f.created_at DESC
      `;
      return { success: true, decks };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ["get-favorites"], { tags: ['favorites'], revalidate: 75 }
);

export const getCommunityDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await sql`
        SELECT d.*, COUNT(DISTINCT c.id) AS totalcards, u.username, COALESCE(AVG(r.rating), 0) AS avg_rating,
        EXISTS(SELECT 1 FROM favorite_decks WHERE deck_id = d.id AND viewer_id = ${userId}) AS is_favorite
        FROM decks AS d
        INNER JOIN users AS u ON d.creator_id = u.id
        LEFT JOIN cards AS c ON d.id = c.deck_id
        LEFT JOIN ratings AS r ON d.id = r.deck_id
        WHERE d.public = true
        AND u.username != 'localAdmin'
        GROUP BY d.id, u.id
      `;
      return { success: true, decks };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ["get-recent-decks"], { tags: ['recent-decks', 'favorites'], revalidate: 90 }
);

export async function getCachedDeck({ deckId, userId }: { deckId: number, userId: string }) {
  if(!deckId || isNaN(deckId)) {
    return { success: false, error: 'Invalid deck ID' };
  }
  return unstable_cache(
    async () => {
      try {
        const [deck, cards, avg_rating] = await Promise.all([
          sql`
            SELECT d.id, d.creator_id, d.name, d.public, d.created_at, d.updated_at, u.username,
            EXISTS(SELECT 1 FROM favorite_decks WHERE deck_id = d.id AND viewer_id = ${userId}) AS is_favorite
            FROM decks AS d
            INNER JOIN users AS u
            ON d.creator_id = u.id
            WHERE d.id = ${deckId}
          `,
          sql`
            SELECT front, back
            FROM cards
            WHERE deck_id = ${deckId}
          `,
          sql`
            SELECT AVG(rating) AS avg_rating
            FROM ratings
            WHERE deck_id = ${deckId}
            GROUP BY deck_id
          `
        ]);
        if(!deck[0]) {
          return { success: false, error: 'Deck not found' };
        }
        const avgRating = avg_rating[0]?.avg_rating ? parseFloat(avg_rating[0].avg_rating) : 0;
        return { success: true, deck: deck[0], cards, avgRating };
      }
      catch(error) {
        return { success: false, error };
      }
    }, [`deck-${deckId}`], { tags: [`deck-${deckId}`], revalidate: 90 }
  )();
}

export async function getFeaturedDeck({ deckId, userId }: { deckId: number, userId: string }) {
  return unstable_cache(
    async () => {
      const [deck, cards, avg_rating] = await Promise.all([
        sql`
          SELECT d.id, d.creator_id, d.name, d.public, d.created_at, d.updated_at, u.username,
          EXISTS(SELECT 1 FROM favorite_decks WHERE deck_id = d.id AND viewer_id = ${userId}) AS is_favorite
          FROM decks AS d
          INNER JOIN users AS u
          ON d.creator_id = u.id
          WHERE d.id = ${deckId}
        `,
        sql`
          SELECT front, back
          FROM cards
          WHERE deck_id = ${deckId}
        `,
        sql`
          SELECT AVG(rating) AS avg_rating
          FROM ratings
          WHERE deck_id = ${deckId}
          GROUP BY deck_id
        `
      ]);
      const avgRating = avg_rating[0]?.avg_rating ? parseFloat(avg_rating[0].avg_rating) : 0;
      return { success: true, deck: deck[0], cards, avgRating };
    }, [`get-featured-deck-${deckId}`], { tags: [`featured-deck-${deckId}`], revalidate: 600 }
  )();
}

export async function updateDeck({ deckId, title, cards, isPublic }: { deckId: number, title: string, cards: { deck_id: number, front: string, back: string }[], isPublic: boolean }) {
  "use server";
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
      sql(query.slice(0, -2), queryParams)
    ])
    revalidateTag('decks')
    revalidateTag(`deck-${deckId}`)
    revalidateTag('recent-decks')
    if(deckId === 9 || deckId === 11 || deckId === 12) {
      revalidateTag(`featured-deck-${deckId}`)
    }
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function deleteDeck(deckId: number) {
  "use server";
  try {
    await sql`DELETE FROM decks WHERE id = ${deckId}`;
    revalidateTag('decks');
    revalidateTag(`deck-${deckId}`);
    if(deckId === 9 || deckId === 11 || deckId === 12) {
      revalidateTag(`featured-deck-${deckId}`)
    }
    revalidateTag('recent-decks');
    revalidateTag('favorites');
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function addToFavorites({ deckId, userId }: { deckId: number, userId: string }) {
  "use server";
  try {
    await sql`
      INSERT INTO favorite_decks(deck_id, viewer_id)
      VALUES (${deckId}, ${userId})
    `;
    revalidateTag('favorites');
    revalidateTag(`deck-${deckId}`);
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function removeFromFavorites({ deckId, userId }: { deckId: number, userId: string }) {
  "use server";
  try {
    await sql`
      DELETE FROM favorite_decks
      WHERE deck_id = ${deckId}
      AND viewer_id = ${userId}
    `;
    revalidateTag('favorites');
    revalidateTag(`deck-${deckId}`);
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}