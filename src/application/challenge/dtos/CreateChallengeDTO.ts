import { z } from "zod";

export const CreateChallengeSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string(),
  points: z.coerce.number().default(10),
  challenge_type: z.enum(["daily", "weekly", "interpretation"]).default("daily"),
  is_premium: z.boolean().default(false),
});

export type CreateChallengeDTO = z.infer<typeof CreateChallengeSchema>;
