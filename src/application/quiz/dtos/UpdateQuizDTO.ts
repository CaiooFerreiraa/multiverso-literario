import { z } from "zod";

export const UpdateQuizAlternativesSchema = z.object({
  alternative: z.coerce.string(),
  is_correct: z.coerce.boolean(),
  id_alternative: z.coerce.number().positive().optional()
})


export const UpdateQuizQuestionsSchema = z.object({
  id_question: z.coerce.number().optional(),
  question_tittle: z.string(),
  alternatives: z.array(
    UpdateQuizAlternativesSchema
  )
})

export const UpdateQuizSchema = z.object({
  id_quiz: z.coerce.number().optional(),
  tittle: z.string(),
  id_timeline_book: z.coerce.number(),
  statement: z.string().default('ativo'),
  questions: z.array(
    UpdateQuizQuestionsSchema
  ),
});

export type UpdateQuizDTO = z.infer<typeof UpdateQuizSchema>;
export type UpdateQuizAlternativeDTO = z.infer<typeof UpdateQuizAlternativesSchema>;
export type UpdateQuizQuestionsDTO = z.infer<typeof UpdateQuizQuestionsSchema>;
