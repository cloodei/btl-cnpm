'use server';
import { query } from '@/lib/db';

export async function createUserInDB(userId: string, username: string) {
  "use server";
  try {
    await query('INSERT INTO users (id, name) VALUES ($1, $2)', [userId, username]);
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}