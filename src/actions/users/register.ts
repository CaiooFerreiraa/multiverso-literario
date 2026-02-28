"use server";

import bcrypt from "bcryptjs";
import { neonClient } from "@/infrastructure/database/neon";
import { UserNeonDatabase } from "@/infrastructure/users/User.databaseNeon";
import { UserRegister } from "@/application/users/usecases/UserRegister";
import { CreateUserDTO, CreateUserSchema } from "@/application/users/dtos/CreateUserDTO";

// Inicializa as dependências em escopo de módulo ou dentro da função.
// Para Server Actions, é interessante iniciar dentro da função ou arquivo para evitar conflitos de estado no server edge (dependendo do deploy).
const getRegisterUseCase = () => {
  const userRepository = new UserNeonDatabase(neonClient);
  return new UserRegister(userRepository);
};

import { z } from "zod";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function registerUserAction(prevState: any, formData: FormData) {
  let userEmail = "";
  let userPassword = "";

  try {
    // 1. Extração de dados do FormData
    const rawData = {
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      birthday: formData.get("birthday") as string,
      city: formData.get("city") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      password: formData.get("password") as string,
    };

    userEmail = rawData.email;
    userPassword = rawData.password; // Manter a senha original para o auto-login

    // 2. Validação básica com Zod
    const validData: CreateUserDTO = CreateUserSchema.parse(rawData);

    // 3. Hasheando a senha antes de salvar no DB
    const hashedPassword = await bcrypt.hash(validData.password, 10);
    const dataToSave = { ...validData, password: hashedPassword };

    // 4. Execução do Caso de Uso
    const useCase = getRegisterUseCase();
    await useCase.execute(dataToSave);

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Verifique os dados informados.";
      return { success: false, error: firstError };
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Erro no registro:", errorMessage);
    return { success: false, error: "Ocorreu um erro ao criar a conta." };
  }

  // Se chegou aqui, o usuário foi criado com sucesso.
  // Fazemos o login automático e redirecionamos.
  try {
    await signIn("credentials", {
      email: userEmail,
      password: userPassword,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // No Next.js, o redirect() joga um erro especial que o router captura. 
    // Por isso, se for um erro de redirecionamento, devemos re-lançar.
    throw error;
  }
}
