import { z } from "zod";

export const CreateQuizDTO = z.object({
  tittle: z.string(),
  id_timeline_book: z.number(),
  statement: z.string().default("não respondido"),
  questions: z.array(
    z.object({
      question: z.string(),
      alternatives: z.array(
        z.object({
          alternative: z.string(),
          is_correct: z.boolean()
        })
      )
    })
  )
});

export type CreateQuizDTO = z.infer<typeof CreateQuizDTO>;
