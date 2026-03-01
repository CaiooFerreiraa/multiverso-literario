import { z } from 'zod';

export const CreatePlanSchema = z.object({
  value: z.coerce.number(),
  duraction: z.coerce.string()
})

export type CreatePlanDTO = z.infer<typeof CreatePlanSchema>;
