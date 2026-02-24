import { z } from 'zod';

export const CreateBuyPlanSchema = z.object({
  id_plan: z.coerce.number().positive(),
  id_user: z.coerce.number().positive(),
  price_paid: z.coerce.number(),
  status: z.coerce.string(),
  method_payment: z.coerce.string()
});

export type CreateBuyPlanDTO = z.infer<typeof CreateBuyPlanSchema>;