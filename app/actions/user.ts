'use server';
import sql from '@/lib/db';

export async function getUserInfo(userId: string) {
  try {
    const user = await sql`
      SELECT *
      FROM users
      WHERE id = ${userId}
    `;
    return { success: true, user: user[0] };
  }
  catch(error) {
    return { success: false, error: 'Failed to load profile' };
  }
}