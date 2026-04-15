"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { ChallengeDatabaseNeon } from "@/infrastructure/challenge/Challenge.databaseNeon";
import { CreateChallenge } from "@/application/challenge/usecases/CreateChallenge";
import { CreateChallengeSchema } from "@/application/challenge/dtos/CreateChallengeDTO";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const getChallengeRepo = () => new ChallengeDatabaseNeon(neonClient);

const ManualPointsSchema = z.object({
  id_user: z.coerce.number().int().positive(),
  title: z.string().trim().min(3, "Informe um motivo com pelo menos 3 caracteres"),
  description: z.string().trim().optional().default(""),
  points: z.coerce.number().int().positive("Informe uma pontuação maior que zero"),
});

export async function createChallengeAction(data: any) {
  try {
    const validData = CreateChallengeSchema.parse(data);
    const useCase = new CreateChallenge(getChallengeRepo());
    const result = await useCase.execute(validData);
    revalidatePath("/home/admin");
    revalidatePath("/home/desafios");
    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Dados inválidos" };
    }
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUsersForManualPointsAction() {
  try {
    const result = await neonClient.query<{
      id_user: number;
      name: string;
      email: string | null;
    }>(
      `SELECT id_user, fullname AS name, email
       FROM users
       ORDER BY fullname ASC NULLS LAST, id_user ASC`
    );

    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error), data: [] };
  }
}

export async function grantManualPointsAction(data: unknown) {
  try {
    const validData = ManualPointsSchema.parse(data);

    await neonClient.transaction(async (tx) => {
      const user = await tx.query<{ id_user: number }>(
        `SELECT id_user FROM users WHERE id_user = $1`,
        [validData.id_user]
      );

      if (user.length === 0) {
        throw new Error("Usuário não encontrado");
      }

      await tx.query(
        `INSERT INTO member (id_user, "phoneNumber", city, birthday)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_user) DO NOTHING`,
        [validData.id_user, "0000000000", "Multiverso", "2000-01-01"]
      );

      const [challenge] = await tx.query<{ id_challenge: number }>(
        `INSERT INTO reading_challenges (title, description, points, challenge_type, is_premium)
         VALUES ($1, $2, $3, $4, false)
         RETURNING id_challenge`,
        [validData.title, validData.description || "Pontuação manual lançada pela administração.", validData.points, "manual"]
      );

      await tx.query(
        `INSERT INTO user_challenges (id_user, id_challenge, points_earned)
         VALUES ($1, $2, $3)`,
        [validData.id_user, challenge.id_challenge, validData.points]
      );
    });

    revalidatePath("/home");
    revalidatePath("/home/admin");
    revalidatePath("/home/ranking");
    revalidatePath("/home/desafios");

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Dados inválidos" };
    }

    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAllChallengesAction(is_premium?: boolean) {
  try {
    const repo = getChallengeRepo();
    const result = await repo.readAll(is_premium);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function completeChallengeAction(id_user: number, id_challenge: number, points: number) {
  try {
    const repo = getChallengeRepo();
    await repo.completeChallenge(id_user, id_challenge, points);
    revalidatePath("/home");
    revalidatePath("/home/desafios");
    revalidatePath("/home/ranking");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserChallengesAction(id_user: number) {
  try {
    const repo = getChallengeRepo();
    const result = await repo.readUserChallenges(id_user);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readUserPointsAction(id_user: number) {
  try {
    const repo = getChallengeRepo();
    const result = await repo.readUserPoints(id_user);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteChallengeAction(id_challenge: number) {
  try {
    const repo = getChallengeRepo();
    await repo.delete(id_challenge);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
