"use server";

import { revalidatePath } from "next/cache";
import { neonClient } from "@/infrastructure/database/neon";
import { PlanDatabaseNeon } from "@/infrastructure/plan/Plan.databaseNeon";
import { CreatePlan } from "@/application/plan/usecases/CreatePlan";

const getPlanRepository = () => new PlanDatabaseNeon(neonClient);

export async function subscribeToPlanAction(userId: any, planId: number, price: number) {
  try {
    const repo = getPlanRepository();
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    if (isNaN(id)) {
      throw new Error("ID de usuário inválido para assinatura.");
    }

    // Check if member exists (buy table has FK to member, not users)
    const memberCheck = await neonClient.query(`SELECT id_user FROM member WHERE id_user = $1`, [id]);
    if (memberCheck.length === 0) {
      // Create a placeholder member record if it doesn't exist
      // Since phone, city, and birthday are NOT NULL, we use defaults
      await neonClient.query(
        `INSERT INTO member (id_user, "phoneNumber", city, birthday) VALUES ($1, $2, $3, $4)`,
        [id, '0000000000', 'Multiverso', new Date('2000-01-01')]
      );
    }

    /**
     * @PLACEHOLDER_PAGAMENTO
     * Aqui integraremos a tecnologia de pagamento (ex: Mercado Pago, Stripe, Pagar.me)
     */

    // Simulação de transação concluída com sucesso
    await repo.contract({
      id_plan: planId,
      id_user: id,
      price_paid: price,
      status: 'concluido',
      method_payment: 'pix'
    } as any);

    revalidatePath("/home");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updatePlanAction(id_plan: number, data: any) {
  try {
    const repo = getPlanRepository();
    await repo.update(id_plan, data);
    revalidatePath("/home/planos");
    revalidatePath("/home/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar plano" };
  }
}

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
