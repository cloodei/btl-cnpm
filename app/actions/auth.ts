'use server';
import sql from '@/lib/db';

export async function createUserInDb(userId: string, username: string) {
  try {
    await sql`
      INSERT INTO users (id, name)
      VALUES (${userId}, ${username})
    `;
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}