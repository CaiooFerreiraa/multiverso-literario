import { z } from "zod";

export const UpdateTimelineSchema = z.object({
  id_timeline: z.coerce.number(),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  nameBook: z.coerce.string(),
  authorBook: z.coerce.string()
})

export type UpdateTimelineDTO = z.infer<typeof UpdateTimelineSchema>;