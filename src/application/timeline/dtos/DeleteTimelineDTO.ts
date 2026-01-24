import { z } from 'zod';

export const DeleteTimelineSchema = z.object({
  id_timeline: z.coerce.number().positive()
});

export type DeleteTimelineDTO = z.infer<typeof DeleteTimelineSchema>;

