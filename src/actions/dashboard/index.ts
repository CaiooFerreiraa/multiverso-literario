"use server";

import { neonClient } from "@/infrastructure/database/neon";

export async function readCurrentTimelineAction() {
  try {
    const result = await neonClient.query(
      `SELECT t.id_timeline, t.date_start, t.date_end,
              tb.id_timeline_book, tb.name, tb.author
       FROM timeline t
       JOIN timeline_book tb ON t.id_timeline = tb.id_timeline_book
       WHERE t.date_end >= CURRENT_DATE
       ORDER BY t.date_start ASC
       LIMIT 1`
    );
    return { success: true, data: result.length > 0 ? result[0] : null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAllTimelinesAction() {
  try {
    const result = await neonClient.query(
      `SELECT t.id_timeline, t.date_start, t.date_end,
              tb.id_timeline_book, tb.name, tb.author
       FROM timeline t
       JOIN timeline_book tb ON t.id_timeline = tb.id_timeline_book
       ORDER BY t.date_start DESC`
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserSealsAction(id_user: number) {
  try {
    const result = await neonClient.query(
      `SELECT ls.*, us.awarded_at
       FROM literary_seals ls
       LEFT JOIN user_seals us ON ls.id_seal = us.id_seal AND us.id_user = $1
       ORDER BY ls.months_required ASC`,
      [id_user]
    );
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserPlanStatusAction(id_user: number) {
  try {
    const result = await neonClient.query(
      `SELECT b.*, pe.value, pe.duraction
       FROM buy b
       JOIN plan_expanded pe ON b.id_plan = pe.id_plan
       WHERE b.id_user = $1 AND b.status = 'concluido'
       ORDER BY b.created_at DESC
       LIMIT 1`,
      [id_user]
    );
    return { success: true, data: result.length > 0 ? result[0] : null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
