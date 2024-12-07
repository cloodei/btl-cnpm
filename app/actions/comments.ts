"use server";
import sql from "@/lib/db";

export async function getComments(deckId: number, page: number = 1) {
  try {
    const offset = (page - 1) * 10;
    const [comments, totalCount] = await Promise.all([
      sql`
        SELECT c.*, u.username, u.imageurl
        FROM comments c
        JOIN users u ON c.commenter_id = u.id
        WHERE c.deck_id = ${deckId}
        ORDER BY c.created_at DESC
        LIMIT 10 OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) 
        FROM comments 
        WHERE deck_id = ${deckId}
      `
    ]);
    const total = parseInt(totalCount[0].count);
    return {
      comments,
      totalCount: total,
      hasMore: (offset + comments.length) < total
    };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function addComment({ deckId, userId, comment }: { deckId: number, userId: string, comment: string }) {
  try {
    const [result] = await sql`
      INSERT INTO comments (commenter_id, deck_id, comment)
      VALUES (${userId}, ${deckId}, ${comment})
      RETURNING id
    `;
    return result;
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function updateComment({ commentId, comment }: { commentId: number, comment: string }) {
  try {
    await sql`
      UPDATE comments 
      SET comment = ${comment}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${commentId}
    `;
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}

export async function deleteComment(commentId: number) {
  try {
    await sql`
      DELETE FROM comments WHERE id = ${commentId}
    `;
    return { success: true };
  }
  catch(error) {
    return { success: false, error };
  }
}