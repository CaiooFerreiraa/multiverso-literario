import { z } from "zod";

export const CreateUserSchema = z.object({
  fullname: z.string().min(4, "O nome deve estar completo"),
  email: z.string().email("Formato inválido"), // Corrigido: z.string().email()
  birthday: z.coerce.date(),
  city: z.string(),
  phoneNumber: z.string().min(10, "Telefone deve ter DDD e número"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
