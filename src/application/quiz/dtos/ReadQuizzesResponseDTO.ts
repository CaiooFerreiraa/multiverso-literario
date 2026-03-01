import { z } from 'zod';

export const ReadQuizzesResponseSchema = z.object({
  id_user: z.coerce.number().positive()
});

export type ReadQuizzesResponseDTO = z.infer<typeof ReadQuizzesResponseSchema>;
