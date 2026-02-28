"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { ChallengeDatabaseNeon } from "@/infrastructure/challenge/Challenge.databaseNeon";
import { CreateChallenge } from "@/application/challenge/usecases/CreateChallenge";
import { CreateChallengeSchema } from "@/application/challenge/dtos/CreateChallengeDTO";
import { z } from "zod";

const getChallengeRepo = () => new ChallengeDatabaseNeon(neonClient);

export async function createChallengeAction(data: any) {
  try {
    const validData = CreateChallengeSchema.parse(data);
    const useCase = new CreateChallenge(getChallengeRepo());
    const result = await useCase.execute(validData);
    return { success: true, data: result };
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
