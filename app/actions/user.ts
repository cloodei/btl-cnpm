'use server';
import { unstable_cache, revalidateTag } from 'next/cache';
import { query } from '@/lib/db';

export async function revalidateUser() {
  'use server';
  revalidateTag('user');
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

export const getCachedUserInfoWithDecks = unstable_cache(async (userId: string) => {
  try {
    const [users, stats] = await Promise.all([
      query(`
        SELECT * FROM users WHERE id = $1
      `, [userId]),
      query(`
      SELECT COUNT(DISTINCT d.id) as totaldecks, COUNT(c.id) as totalcards
      FROM decks d
      LEFT JOIN cards c ON d.id = c.deck_id
      WHERE d.creator_id = $1
      `, [userId])
    ]);
    return { success: true, user: users[0], decks: stats[0] };
  }
  catch(error) {
    return { success: false, error };
  }
}, ['user-info-decks'], { tags: ["user-info-decks"], revalidate: 1800 });

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