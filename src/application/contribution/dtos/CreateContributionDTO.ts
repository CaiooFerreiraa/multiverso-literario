import { z } from "zod";

export const CreateContributionSchema = z.object({
  content: z.string().min(3, "A contribuição deve ter pelo menos 3 caracteres"),
  id_user: z.coerce.number().positive(),
  id_timeline_book: z.coerce.number().positive(),
});

export type CreateContributionDTO = z.infer<typeof CreateContributionSchema>;
