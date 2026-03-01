"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export interface CreateScheduledRoomDTO {
  title: string;
  description?: string;
  category: string;
  scheduledAt: string; // ISO string
  idTimelineBook?: number | null;
}

export interface ScheduledRoom {
  id_room: number;
  title: string;
  description: string | null;
  category: string;
  slug: string;
  scheduled_at: string;
  created_by: number;
  id_timeline_book: number | null;
  is_active: boolean;
  created_at: string;
  // Joined
  book_name?: string;
  book_author?: string;
  creator_name?: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 200)
    + "-" + Date.now().toString(36);
}

export async function createScheduledRoomAction(data: CreateScheduledRoomDTO) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Não autenticado" };
    }

    const userId = (session.user as any).id;
    const slug = generateSlug(data.title);

    const result = await neonClient.query(
      `INSERT INTO scheduled_rooms (title, description, category, slug, scheduled_at, created_by, id_timeline_book)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.category,
        slug,
        data.scheduledAt,
        userId,
        data.idTimelineBook || null,
      ]
    );

    revalidatePath("/dashboard/salas");
    revalidatePath("/dashboard/admin");
    return { success: true, data: result[0] };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar sala agendada" };
  }
}

export async function listScheduledRoomsAction() {
  try {
    const result = await neonClient.query<ScheduledRoom>(
      `SELECT sr.*,
              tb.name as book_name,
              tb.author as book_author,
              u.fullname as creator_name,
              u.email as creator_email
       FROM scheduled_rooms sr
       LEFT JOIN timeline_book tb ON sr.id_timeline_book = tb.id_timeline_book
       LEFT JOIN users u ON sr.created_by = u.id_user
       WHERE sr.is_active = true
       ORDER BY sr.scheduled_at ASC`
    );

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao listar salas" };
  }
}

export async function deleteScheduledRoomAction(roomId: number) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Não autenticado" };
    }

    await neonClient.query(
      `UPDATE scheduled_rooms SET is_active = false WHERE id_room = $1`,
      [roomId]
    );

    revalidatePath("/dashboard/salas");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao remover sala" };
  }
}

export async function listTimelinesForSelectAction() {
  try {
    const result = await neonClient.query(
      `SELECT tb.id_timeline_book, tb.name, tb.author, t.date_start, t.date_end
       FROM timeline_book tb
       JOIN timeline t ON t.id_timeline = tb.id_timeline_book
       ORDER BY t.date_start DESC
       LIMIT 20`
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function trackRoomAttendanceAction(id_room: number, seconds: number) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Não autenticado" };
    const id_user = (session.user as any).id;

    await neonClient.query(
      `INSERT INTO user_call_attendance (id_user, id_room, total_seconds_spent, last_joined_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (id_user, id_room) 
       DO UPDATE SET 
         total_seconds_spent = user_call_attendance.total_seconds_spent + EXCLUDED.total_seconds_spent,
         updated_at = NOW()`,
      [id_user, id_room, seconds]
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
