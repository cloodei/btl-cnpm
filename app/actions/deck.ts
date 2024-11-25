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

// type FormState = {
//   status: 'idle' | 'success' | 'error';
//   message?: string;
//   errors?: { title?: string; cards?: string; };
// };

// export async function createDeckAction(prevState: FormState, formData: FormData): Promise<FormState> {
//   try {
//     const title = (formData.get('title') as string).trim();
//     const isPublic = (formData.get('isPublic') === 'true');
//     const cards = JSON.parse(formData.get('cards') as string);
//     if(!title) {
//       return { status: 'error', errors: { title: 'Title is required' } };
//     }
//     if(title.length > 64) {
//       return { status: 'error', errors: { title: 'Title must be 64 characters or less' } };
//     }
//     const validCards = cards.filter((card: { front: string, back: string }) => card.front.trim() && card.back.trim());
//     if(!validCards.length) {
//       return { status: 'error', errors: { cards: 'At least one complete card is required' } };
//     }
//     const result = await createDeck({ title, cards: validCards, isPublic });
//     if(!result.success) {
//       return { status: 'error', message: result.error as string };
//     }
//     return { status: 'success', message: 'Deck created successfully' };
//   }
//   catch (error) {
//     return { status: 'error', message: 'An unexpected error occurred' };
//   }
// }

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

export const getFavoriteDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await sql`
        SELECT d.id, d.name, f.created_at, COUNT(c.id) AS totalcards, u.username
        FROM decks AS d
        INNER JOIN favorite_decks AS f
        ON d.id = f.deck_id
        INNER JOIN users AS u
        ON d.creator_id = u.id
        LEFT JOIN cards AS c
        ON d.id = c.deck_id
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

export const getRecentDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await sql`
        SELECT d.*, COUNT(c.id) AS totalcards, u.username,
        EXISTS(SELECT 1 FROM favorite_decks WHERE deck_id = d.id AND viewer_id = ${userId}) AS is_favorite
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
  }, ["get-recent-decks"], { tags: ['recent-decks', 'favorites'], revalidate: 90 }
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
      SELECT front, back
      FROM cards
      WHERE deck_id = ${deckId}
    `;
    return { success: true, deck, cards };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function getCachedDeck({ deckId, userId }: { deckId: number, userId: string }) {
  if(isNaN(deckId) || !deckId) {
    return { success: false, error: 'Invalid deck ID' };
  }
  return unstable_cache(async () => {
      const [deck, cards] = await Promise.all([
        sql`
          SELECT d.id, d.creator_id, d.name, d.total_rating, d.count_ratings, d.public, d.created_at, d.updated_at, u.username,
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
        `
      ]);
      return { success: true, deck: deck[0], cards };
    }, [`deck-${deckId}`], { tags: [`deck-${deckId}`], revalidate: 60 }
  )();
}

export async function getFeaturedDeck({ deckId, userId }: { deckId: number, userId: string }) {
  return unstable_cache(async () => {
      const [deck, cards] = await Promise.all([
        sql`
          SELECT d.id, d.creator_id, d.name, d.total_rating, d.count_ratings, d.public, d.created_at, d.updated_at, u.username,
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
        AS cards(deck_id int, front varchar, back varchar)
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

export async function addToFavorites({ deckId, userId }: { deckId: number, userId: string }) {
  "use server";
  try {
    await sql`
      INSERT INTO favorite_decks(deck_id, viewer_id)
      VALUES (${deckId}, ${userId})
    `;
    revalidateTag('favorites');
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