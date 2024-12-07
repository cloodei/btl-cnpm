'use server';
import sql, { query } from '@/lib/db';
import { unstable_cache, revalidateTag } from 'next/cache';

export async function revalidateUser() {
  "use server";
  revalidateTag('user-info');
  revalidateTag('user-info-decks');
  revalidateTag('recent-decks');
  revalidateTag('favorites');
  revalidateTag('decks');
}

export const getCachedUserInfo = unstable_cache(async (userId: string) => {
    try {
      const users = await query('SELECT * FROM users WHERE id = $1', [userId]);
      return { success: true, user: users[0] };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ['user-info'], { tags: ["user-info"], revalidate: 300 }
);

export const getCachedUserInfoWithDecks = unstable_cache(async (userId: string) => {
    try {
      const [user, stats, countFav] = await Promise.all([
        sql`
          SELECT * FROM users WHERE id = ${userId}
        `,
        sql`
          SELECT COUNT(DISTINCT d.id) as totaldecks, COUNT(c.id) as totalcards
          FROM decks AS d
          LEFT JOIN cards AS c ON d.id = c.deck_id
          WHERE d.creator_id = ${userId}
        `,
        sql`
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
  }, ['user-info-decks'], { tags: ["user-info-decks"], revalidate: 300 }
);

export async function updateProfile({ userId, username, imageUrl }: { userId: string, username: string, imageUrl: string }) {
  'use server';
  try {
    const [userDecks] = await Promise.all([
      sql`
        SELECT id FROM decks WHERE creator_id = ${userId}
      `,
      sql`
        UPDATE users
        SET username = ${username}, imageurl = ${imageUrl}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
    ]);
    revalidateTag('user-info');
    revalidateTag('user-info-decks');
    revalidateTag('recent-decks');
    revalidateTag('favorites');
    for(const deck of userDecks) {
      revalidateTag(`deck-${deck.id}`);
    }
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}