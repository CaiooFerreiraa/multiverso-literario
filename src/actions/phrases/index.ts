"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { revalidatePath } from "next/cache";

export async function createPhraseAction(data: { description: string; id_user: number }) {
  try {
    const [result] = await neonClient.query(
      `INSERT INTO phrases (description, id_user)
       VALUES ($1, $2)
       RETURNING id_phrases, description, id_user`,
      [data.description, data.id_user]
    );
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAllPhrasesAction() {
  try {
    const result = await neonClient.query(
      `SELECT p.id_phrases, p.description, u.fullname
       FROM phrases p
       JOIN users u ON p.id_user = u.id_user
       ORDER BY p.id_phrases DESC`
    );
    return { success: true, data: result };
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
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
