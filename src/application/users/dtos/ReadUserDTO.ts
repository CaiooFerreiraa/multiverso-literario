import { email, z } from "zod"

export const ReadUserSchema = z.object({
  email: z.email()
});

export type ReadUserDTO = z.infer<typeof ReadUserSchema>;
