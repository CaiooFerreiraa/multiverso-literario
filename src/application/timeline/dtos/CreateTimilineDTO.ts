import { z } from "zod";

export const CreateTimelineSchema = z.object({
  dateStart: z.date(),
  dateEnd: z.date(),
  authorBook: z.string(),
  nameBook: z.string()
})

export type CreateTimelineDTO = z.infer<typeof CreateTimelineSchema>