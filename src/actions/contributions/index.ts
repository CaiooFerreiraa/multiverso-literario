"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { ContributionDatabaseNeon } from "@/infrastructure/contribution/Contribution.databaseNeon";
import { CreateContribution } from "@/application/contribution/usecases/CreateContribution";
import { ReadContributionsByBook } from "@/application/contribution/usecases/ReadContributionsByBook";
import { CreateContributionSchema } from "@/application/contribution/dtos/CreateContributionDTO";
import { z } from "zod";

import { revalidatePath } from "next/cache";

const getContributionRepo = () => new ContributionDatabaseNeon(neonClient);

export async function createContributionAction(data: {
  content: string;
  id_user: number;
  id_timeline_book: number;
}) {
  try {
    const validData = CreateContributionSchema.parse(data);
    const useCase = new CreateContribution(getContributionRepo());
    const result = await useCase.execute(validData);
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/livro/${data.id_timeline_book}`);
    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Dados inválidos" };
    }
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function readContributionsByBookAction(id_timeline_book: number) {
  try {
    const useCase = new ReadContributionsByBook(getContributionRepo());
    const result = await useCase.execute(id_timeline_book);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteContributionAction(id_contribution: number) {
  try {
    const repo = getContributionRepo();
    await repo.delete(id_contribution);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
