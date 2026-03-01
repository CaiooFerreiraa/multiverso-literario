"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { revalidatePath } from "next/cache";

export async function createPhraseAction(data: { description: string; id_user: number; is_autoral?: boolean }) {
  try {
    const [result] = await neonClient.query(
      `INSERT INTO phrases (description, id_user, is_autoral)
       VALUES ($1, $2, $3)
       RETURNING id_phrases, description, id_user, is_autoral, created_at`,
      [data.description, data.id_user, data.is_autoral || false]
    );
    revalidatePath("/dashboard/frases");
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAllPhrasesAction(options: {
  currentUserId?: number;
  page?: number;
  limit?: number;
  onlyMine?: boolean;
}) {
  try {
    const { currentUserId, page = 1, limit = 9, onlyMine = false } = options;
    const offset = (page - 1) * limit;

    const safeUserId = currentUserId ? parseInt(currentUserId.toString()) : null;
    const isLikedSql = (safeUserId && !isNaN(safeUserId))
      ? `EXISTS(SELECT 1 FROM phrase_likes WHERE id_phrase = p.id_phrases AND id_user = ${safeUserId})`
      : 'false';

    const whereClause = onlyMine && safeUserId ? `WHERE p.id_user = ${safeUserId}` : '';

    // Get total count for pagination
    const [countResult] = await neonClient.query(
      `SELECT COUNT(*) as total FROM phrases p ${whereClause}`
    );
    const totalItems = parseInt(countResult.total);
    const totalPages = Math.ceil(totalItems / limit);

    console.log(`Fetching phrases: page=${page}, limit=${limit}, onlyMine=${onlyMine}, whereClause="${whereClause}"`);

    const result = await neonClient.query(`
      SELECT p.id_phrases, p.description, p.created_at, p.is_autoral, p.id_user, u.fullname, u.image as user_image,
             (SELECT COUNT(*) FROM phrase_likes WHERE id_phrase = p.id_phrases) as likes_count,
             ${isLikedSql} as is_liked
      FROM phrases p
      LEFT JOIN users u ON p.id_user = u.id_user
      ${whereClause}
      ORDER BY p.id_phrases DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    console.log(`Found ${result.length} phrases out of ${totalItems} total.`);

    return {
      success: true,
      data: result,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit
      }
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function toggleLikePhraseAction(id_phrase: number, id_user: number) {
  try {
    // Check if already liked
    const exists = await neonClient.query(
      `SELECT id_like FROM phrase_likes WHERE id_phrase = $1 AND id_user = $2`,
      [id_phrase, id_user]
    );

    if (exists.length > 0) {
      // Unlike
      await neonClient.query(
        `DELETE FROM phrase_likes WHERE id_phrase = $1 AND id_user = $2`,
        [id_phrase, id_user]
      );
    } else {
      // Like
      await neonClient.query(
        `INSERT INTO phrase_likes (id_phrase, id_user) VALUES ($1, $2)`,
        [id_phrase, id_user]
      );
    }

    revalidatePath("/dashboard/frases");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deletePhraseAction(id_phrases: number) {
  try {
    await neonClient.query(
      `DELETE FROM phrases WHERE id_phrases = $1`,
      [id_phrases]
    );
    revalidatePath("/dashboard/frases");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
