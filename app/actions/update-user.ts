"use server";
import typedSql from "@/lib/db";
import { revalidateTag, revalidatePath } from "next/cache";

export async function updateProfile({ userId, username, imageUrl }: { userId: string, username: string, imageUrl: string | null }) {
  try {
    const [userDecks] = await Promise.all([
      typedSql<{ id: number }>`
        SELECT id FROM decks WHERE creator_id = ${userId}
      `,
      typedSql`
        UPDATE users
        SET username = ${username}, imageurl = ${imageUrl}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `
    ]);
    revalidateTag('user-info');
    revalidateTag('user-info-decks');
    revalidateTag('recent-decks');
    revalidateTag('favorites');
    revalidatePath('/profile');
    for(const deck of userDecks) {
      revalidateTag(`deck-${deck.id}`);
    }
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function revalidateUser() {
  revalidateTag('user-info');
  revalidateTag('user-info-decks');
  revalidateTag('recent-decks');
  revalidateTag('favorites');
  revalidateTag('decks');
  revalidatePath('/profile');
}

export async function revalidateUserDecks(userId: string) {
  const result = await typedSql<{ id: number }>`
    SELECT id FROM decks WHERE creator_id = ${userId}
  `;
  for(const deck of result) {
    revalidateTag(`deck-${deck.id}`);
  }
  revalidateTag('user-info-decks');
  revalidateTag('recent-decks');
  revalidateTag('favorites');
  revalidateTag('decks');
}