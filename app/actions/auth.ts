'use server'

import sql from '@/lib/db';

export async function createUserInDb(userId: string, username: string) {
  try {
    await sql`
      INSERT INTO users (id, name)
      VALUES (${userId}, ${username})
    `;
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create user' };
  }
}

export async function updateLastLogin(userId: string) {
  try {
    await sql`
      UPDATE users 
      SET last_sign_in = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
    return { success: true };
  } catch (error) {
    console.error('Login update error:', error);
    return { success: false };
  }
}