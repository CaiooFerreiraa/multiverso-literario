"use server";

import { neonClient } from "@/infrastructure/database/neon";
import { UserNeonDatabase } from "@/infrastructure/users/User.databaseNeon";
import { UserRead } from "@/application/users/usecases/UserRead";
import { UserUpdate } from "@/application/users/usecases/UserUpdate";
import { UserDelete } from "@/application/users/usecases/UserDelete";

const getUserRepository = () => new UserNeonDatabase(neonClient);

export async function readUserAction(email: string) {
  try {
    const useCase = new UserRead(getUserRepository());
    const result = await useCase.execute({ email });
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateUserAction(data: any) {
  try {
    const useCase = new UserUpdate(getUserRepository());
    const result = await useCase.execute(data);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteUserAction(id_user: number) {
  try {
    const useCase = new UserDelete(getUserRepository());
    await useCase.execute({ id_user });
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
