import { z } from "zod";

const DateInputSchema = z
  .union([z.string().min(1, "Informe uma data"), z.date()])
  .transform((value: string | Date): string => {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return value.slice(0, 10);
  });

export const UpdateTimelineSchema = z.object({
  id_timeline: z.coerce.number(),
  dateStart: DateInputSchema,
  dateEnd: DateInputSchema,
  nameBook: z.coerce.string().trim().optional().default(""),
  authorBook: z.coerce.string().trim().optional().default("")
})

export type UpdateTimelineDTO = z.infer<typeof UpdateTimelineSchema>;
