import { z } from 'zod';

export const ReadTimelineSchema = z.object({
  id_timeline: z.coerce.number()
});

export type ReadTimelineDTO = z.infer<typeof ReadTimelineSchema>;
