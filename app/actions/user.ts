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
  }, ['user-info'], { tags: ["user"], revalidate: 900 }
);

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