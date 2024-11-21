'use server';
import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export async function revalidateUser() {
  'use server';
  revalidatePath('/', 'layout');
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

export const getCachedUser = cache(async(userId: string) => {
  if(!userId)
    return null;
  const { user, success } = await getUserInfo(userId);
  return (success ? user : null);
});