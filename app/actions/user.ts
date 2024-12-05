'use server';
import { unstable_cache, revalidateTag } from 'next/cache';
import sql, { query } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';

export async function revalidateUser() {
  'use server';
  revalidateTag('user-info');
  revalidateTag('user-info-decks');
}

export const getCachedUserInfo = unstable_cache(async (userId: string) => {
    try {
      const users = await query('SELECT * FROM users WHERE id = $1', [userId]);
      return { success: true, user: users[0] };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ['user-info'], { tags: ["user-info"], revalidate: 1800 }
);

export async function getCachedUserInfoWithDecks(userId: string) {
  return unstable_cache(async () => {
    try {
      const [users, stats, countFav, allNames] = await Promise.all([
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
        `,
        sql`
          SELECT u.username FROM users AS u
        `
      ]);
      return { success: true, user: users[0], decks: stats[0], countFav: countFav[0].total, allNames };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ['user-info-decks'], { tags: ["user-info-decks"], revalidate: 1800 })();
}

export async function getUserInfo(userId: string) {
  'use server';
  try {
    const users = await query('SELECT * FROM users WHERE id = $1', [userId]);
    return { success: true, user: users[0] };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function updateProfile({ userId, username, imageUrl }: { userId: string, username: string, imageUrl: string }) {
  'use server';
  try {
    const [client, userDecks] = await Promise.all([
      clerkClient(),
      sql`
        SELECT id FROM decks WHERE creator_id = ${userId}
      `,
      sql`
        UPDATE users
        SET username = ${username}, imageurl = ${imageUrl}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
    ]);
    await client.users.updateUser(userId, { username });

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