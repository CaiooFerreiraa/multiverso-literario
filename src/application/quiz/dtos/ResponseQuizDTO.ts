import { z } from 'zod';

export const ResponseQuizSchema = z.object({
  id_user: z.coerce.number().positive(),
  id_quiz: z.coerce.number().positive(),
  id_question: z.coerce.number().positive(),
  id_alternative: z.coerce.number().positive().optional(),
  response_text: z.coerce.string()
})

export type ResponseQuizDTO = z.infer<typeof ResponseQuizSchema>;