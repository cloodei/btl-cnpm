import typedSql, { query } from '@/lib/db';
import { unstable_cache } from 'next/cache';

export type DBUser = {
  id: string,
  username: string,
  imageurl: string,
  created_at: Date,
  updated_at: Date
};

export const getCachedUserInfo = unstable_cache(async (userId: string) => {
    try {
      const users = await query<DBUser>('SELECT * FROM users WHERE id = $1', [userId]);
      return { success: true, user: users[0] };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ['user-info'], { tags: ["user-info"], revalidate: 600 }
);

export const getCachedUserInfoWithDecks = unstable_cache(async (userId: string) => {
    try {
      const [user, stats, countFav] = await Promise.all([
        typedSql<DBUser>`
          SELECT * FROM users WHERE id = ${userId}
        `,
        typedSql<{ totaldecks: number, totalcards: number }>`
          SELECT COUNT(DISTINCT d.id) as totaldecks, COUNT(c.id) as totalcards
          FROM decks AS d
          LEFT JOIN cards AS c ON d.id = c.deck_id
          WHERE d.creator_id = ${userId}
        `,
        typedSql<{ total: number }>`
          SELECT COUNT(*) as total
          FROM favorite_decks
          WHERE viewer_id = ${userId}
        `
      ]);
      return { success: true, user: user[0], decks: stats[0], countFav: countFav[0].total };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ['user-info-decks'], { tags: ["user-info-decks"], revalidate: 600 }
);