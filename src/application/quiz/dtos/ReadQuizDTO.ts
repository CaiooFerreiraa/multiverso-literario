import { z } from 'zod';

export const ReadQuizSchema = z.object({
  id_quiz: z.coerce.number().positive()
});

export type ReadQuizDTO = z.infer<typeof ReadQuizSchema>;
