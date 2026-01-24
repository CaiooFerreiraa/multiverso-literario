import { z } from "zod";

export const DeleteUserSchema = z.object({
  id_user: z.int().positive()
});

export type DeleteUserDTO = z.infer<typeof DeleteUserSchema>;
