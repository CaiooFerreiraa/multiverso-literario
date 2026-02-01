import { z } from 'zod';

export const DeleteQuizSchema = z.object({
  id_quiz: z.coerce.number().positive()
})

export type DeleteQuizDTO = z.infer<typeof DeleteQuizSchema>;