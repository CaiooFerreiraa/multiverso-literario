import { z } from "zod";

export const CreateUserSchema = z.object({
  fullname: z.string().min(4, "O nome deve estar completo"),
  email: z.email("Formato inválido"),
  birthday: z.coerce.date(),
  city: z.string(),
  phoneNumber: z.string().min(12, "Formato de telefone errado"),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Senha inválida"
  )
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
