"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// ==========================================
// ADMIN: Gerenciar recompensas de presença
// ==========================================

export interface CreateAttendanceRewardDTO {
  name: string;
  description?: string;
  required_meetings: number;
  bonus_points: number;
}

export async function createAttendanceRewardAction(data: CreateAttendanceRewardDTO) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Não autenticado" };

    const [result] = await neonClient.query(
      `INSERT INTO attendance_reward (name, description, required_meetings, bonus_points)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.description || null, data.required_meetings, data.bonus_points]
    );

    revalidatePath("/home/admin");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar recompensa" };
  }
}

export async function listAttendanceRewardsAction() {
  try {
    const result = await neonClient.query(
      `SELECT ar.*, 
              (SELECT COUNT(*) FROM attendance_reward_claim arc WHERE arc.id_reward = ar.id_reward) as total_claims
       FROM attendance_reward ar 
       ORDER BY ar.created_at DESC`
    );
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAttendanceRewardAction(id_reward: number) {
  try {
    await neonClient.query(
      `DELETE FROM attendance_reward_claim WHERE id_reward = $1`,
      [id_reward]
    );
    await neonClient.query(
      `DELETE FROM attendance_reward WHERE id_reward = $1`,
      [id_reward]
    );
    revalidatePath("/home/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleAttendanceRewardAction(id_reward: number, is_active: boolean) {
  try {
    await neonClient.query(
      `UPDATE attendance_reward SET is_active = $1 WHERE id_reward = $2`,
      [is_active, id_reward]
    );
    revalidatePath("/home/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// USER: Verificar e resgatar recompensas
// ==========================================

export async function checkAndClaimAttendanceRewardsAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Não autenticado" };
    const id_user = Number((session.user as any).id);

    // Contar participações distintas em salas
    const [attendanceCount] = await neonClient.query(
      `SELECT COUNT(DISTINCT id_room) as total_meetings
       FROM user_call_attendance
       WHERE id_user = $1 AND total_seconds_spent >= 60`,
      [id_user]
    );

    const totalMeetings = Number(attendanceCount?.total_meetings || 0);

    // Buscar recompensas ativas que o usuário ainda não resgatou
    const unclaimedRewards = await neonClient.query(
      `SELECT ar.*
       FROM attendance_reward ar
       WHERE ar.is_active = true
         AND ar.required_meetings <= $1
         AND ar.id_reward NOT IN (
           SELECT id_reward FROM attendance_reward_claim WHERE id_user = $2
         )`,
      [totalMeetings, id_user]
    );

    // Auto-resgatar recompensas elegíveis
    const claimed: any[] = [];
    for (const reward of unclaimedRewards) {
      await neonClient.query(
        `INSERT INTO attendance_reward_claim (id_user, id_reward, points_earned)
         VALUES ($1, $2, $3)
         ON CONFLICT (id_user, id_reward) DO NOTHING`,
        [id_user, reward.id_reward, reward.bonus_points]
      );

      // Registrar pontos como desafio completado
      await neonClient.query(
        `INSERT INTO user_challenges (id_user, id_challenge, points_earned)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [id_user, -reward.id_reward, reward.bonus_points]
      );

      claimed.push(reward);
    }

    return {
      success: true,
      data: {
        totalMeetings,
        claimedNow: claimed,
        totalClaimed: claimed.length,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserAttendanceStatusAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Não autenticado" };
    const id_user = Number((session.user as any).id);

    // Total de participações distintas
    const [attendanceCount] = await neonClient.query(
      `SELECT COUNT(DISTINCT id_room) as total_meetings
       FROM user_call_attendance
       WHERE id_user = $1 AND total_seconds_spent >= 60`,
      [id_user]
    );

    // Recompensas disponíveis (ativas)
    const rewards = await neonClient.query(
      `SELECT ar.*, 
              CASE WHEN arc.id_claim IS NOT NULL THEN true ELSE false END as claimed
       FROM attendance_reward ar
       LEFT JOIN attendance_reward_claim arc ON ar.id_reward = arc.id_reward AND arc.id_user = $1
       WHERE ar.is_active = true
       ORDER BY ar.required_meetings ASC`,
      [id_user]
    );

    return {
      success: true,
      data: {
        totalMeetings: Number(attendanceCount?.total_meetings || 0),
        rewards,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
