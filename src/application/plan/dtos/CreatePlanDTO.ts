import { z } from 'zod';

export const CreatePlanSchema = z.object({
  title: z.string(),
  value: z.coerce.number(),
  duraction: z.coerce.string(),
  benefits: z.array(z.string()).default([]),
  view_type: z.enum(['adult', 'student']).default('adult'),
  features: z.array(z.string()).default([])
})

export type CreatePlanDTO = z.infer<typeof CreatePlanSchema>;

