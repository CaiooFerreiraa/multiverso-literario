"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { revalidatePath } from "next/cache";

export async function createAwardAction(data: {
  id_timeline_book: number;
  name: string;
  description: string;
  image_url: string;
  target_rank: number;
  deadline: string;
}) {
  try {
    await neonClient.query(
      `INSERT INTO awards (id_timeline_book, name, description, image_url, target_rank, deadline)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [data.id_timeline_book, data.name, data.description, data.image_url, data.target_rank, data.deadline]
    );
    revalidatePath("/home/admin");
    revalidatePath("/home/ranking");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAwardsAction() {
  try {
    const result = await neonClient.query(
      `SELECT a.*, t.name as book_name 
       FROM awards a
       LEFT JOIN timeline_book t ON a.id_timeline_book = t.id_timeline_book
       ORDER BY a.is_active DESC, a.deadline ASC`
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function toggleAwardStatusAction(id_award: number, is_active: boolean) {
  try {
    await neonClient.query(
      `UPDATE awards SET is_active = $1 WHERE id_award = $2`,
      [is_active, id_award]
    );
    revalidatePath("/home/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateAwardAction(id_award: number, data: any) {
  try {
    await neonClient.query(
      `UPDATE awards SET name = $1, description = $2, image_url = $3, target_rank = $4, deadline = $5 WHERE id_award = $6`,
      [data.name, data.description, data.image_url, data.target_rank, data.deadline, id_award]
    );
    revalidatePath("/home/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteAwardAction(id_award: number) {
  try {
    await neonClient.query(`DELETE FROM awards WHERE id_award = $1`, [id_award]);
    revalidatePath("/home/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
