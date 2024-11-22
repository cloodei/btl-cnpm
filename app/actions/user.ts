'use server';
import sql from '@/lib/db';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

export const getCachedUserInfo = unstable_cache(async (userId: string) => {
    try {
      const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
      return { success: true, user: user[0] };
    }
    catch(error) {
      return { success: false, error };
    }
  }, ['user-info'], { tags: ["user"], revalidate: 900 }
);

export async function revalidateUser() {
  'use server';
  revalidateTag('user');
}

export async function getUserInfo(userId: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
    return { success: true, user: user[0] };
  }
  catch(error) {
    return { success: false, error };
  }
}