import { z } from "zod";

const DateInputSchema = z
  .union([z.string().min(1, "Informe uma data"), z.date()])
  .transform((value: string | Date): string => {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return value.slice(0, 10);
  });

export const CreateTimelineSchema = z.object({
  dateStart: DateInputSchema,
  dateEnd: DateInputSchema,
  authorBook: z.string().trim().optional().default(""),
  nameBook: z.string().trim().optional().default("")
})

export type CreateTimelineDTO = z.infer<typeof CreateTimelineSchema>
