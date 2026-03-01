import { z } from "zod";

export const CreateTimelineSchema = z.object({
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  authorBook: z.string(),
  nameBook: z.string()
})

export type CreateTimelineDTO = z.infer<typeof CreateTimelineSchema>
