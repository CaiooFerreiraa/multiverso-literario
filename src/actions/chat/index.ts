"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { revalidatePath } from "next/cache";

export async function sendChatMessageAction(data: { id_user: number; id_sender: number; message: string }) {
  try {
    const [result] = await neonClient.query(
      `INSERT INTO admin_chat (id_user, id_sender, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.id_user, data.id_sender, data.message]
    );
    revalidatePath("/home/suporte");
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readChatMessagesAction(id_user: number) {
  try {
    const result = await neonClient.query(
      `SELECT ac.*, u.fullname as sender_name
       FROM admin_chat ac
       JOIN users u ON ac.id_sender = u.id_user
       WHERE ac.id_user = $1
       ORDER BY ac.created_at ASC`,
      [id_user]
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAdminChatUsersAction() {
  try {
    const result = await neonClient.query(
      `SELECT id_user, fullname, image
       FROM users
       ORDER BY fullname ASC`
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
