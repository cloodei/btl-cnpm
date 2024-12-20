import typedSql, { sql } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export const getCachedDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await typedSql<{
        id: number,
        name: string,
        public: boolean,
        created_at: Date,
        updated_at: Date,
        totalcards: number
      }>`
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
      const decks = await typedSql<{
        id: number,
        name: string,
        created_at: Date,
        totalcards: number,
        username: string
      }>`
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
  }, ["get-favorites"], { tags: ['favorites'], revalidate: 120 }
);

export const getCommunityDecksWithCardsCount = unstable_cache(async (userId: string) => {
    try {
      const decks = await typedSql<{
        id: number,
        creator_id: string,
        name: string,
        public: boolean,
        created_at: Date,
        updated_at: Date,
        totalcards: number,
        username: string,
        avg_rating: number,
        is_favorite: boolean
      }>`
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
  }, ["get-recent-decks"], { tags: ['recent-decks', 'favorites'], revalidate: 120 }
);

export async function getCachedDeck({ deckId, userId, revalidate }: { deckId: number, userId: string, revalidate: number }) {
  return unstable_cache(
    async () => {
      try {
        const [deck, cards, avg_rating, is_favorite] = await Promise.all([
          typedSql<{
            id: number,
            creator_id: string,
            name: string,
            public: boolean,
            created_at: Date,
            updated_at: Date,
            username: string
          }>`
            SELECT d.*, u.username
            FROM decks AS d
            INNER JOIN users AS u
            ON d.creator_id = u.id
            WHERE d.id = ${deckId}
          `,
          typedSql<{ front: string, back: string }>`
            SELECT front, back
            FROM cards
            WHERE deck_id = ${deckId}
          `,
          typedSql<{ avg_rating: string }>`
            SELECT AVG(rating) AS avg_rating
            FROM ratings
            WHERE deck_id = ${deckId}
            GROUP BY deck_id
          `,
          sql`
            SELECT 1
            FROM favorite_decks
            WHERE deck_id = ${deckId}
            AND viewer_id = ${userId}
          `
        ]);
        const avgRating = avg_rating[0]?.avg_rating ? parseFloat(avg_rating[0].avg_rating) : 0;
        return { success: true, deck: deck[0], cards, avgRating, isFavorite: is_favorite.length > 0 };
      }
      catch(error) {
        return { success: false, error };
      }
    }, [`deck-${deckId}`], { tags: [`deck-${deckId}`], revalidate }
  )();
}