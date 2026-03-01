import { z } from "zod";

export const CreateQuizAlternativesSchema = z.object({
  alternative: z.coerce.string(),
  is_correct: z.coerce.boolean()
})


export const CreateQuizQuestionsSchema = z.object({
  question_tittle: z.string(),
  points: z.coerce.number().min(1).default(10),
  type: z.enum(["choice", "open"]).default("choice"),
  alternatives: z.array(
    CreateQuizAlternativesSchema
  ).optional().default([])
})

export const CreateQuizSchema = z.object({
  tittle: z.string(),
  id_timeline_book: z.coerce.number(),
  statement: z.string().default("ativo"),
  questions: z.array(
    CreateQuizQuestionsSchema
  ),
});

export type CreateQuizDTO = z.infer<typeof CreateQuizSchema>;
export type CreateQuizAlternativeDTO = z.infer<typeof CreateQuizAlternativesSchema>;
export type CreateQuizQuestionsDTO = z.infer<typeof CreateQuizQuestionsSchema>;
