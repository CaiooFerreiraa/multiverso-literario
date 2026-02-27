"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { PlanDatabaseNeon } from "@/infrastructure/plan/Plan.databaseNeon";
import { CreatePlan } from "@/application/plan/usecases/CreatePlan";

const getPlanRepository = () => new PlanDatabaseNeon(neonClient);

export async function createPlanAction(data: any) {
  try {
    const useCase = new CreatePlan(getPlanRepository());
    const result = await useCase.execute(data);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readPlanAction(id_plan: number) {
  try {
    const repo = getPlanRepository();
    const result = await repo.read(id_plan);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deletePlanAction(id_plan: number) {
  try {
    const repo = getPlanRepository();
    await repo.delete(id_plan);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readAllPlansAction() {
  try {
    const repo = getPlanRepository();
    const result = await repo.readAll();
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
