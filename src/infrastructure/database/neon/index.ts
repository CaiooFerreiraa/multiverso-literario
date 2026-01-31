import { neon } from "@neondatabase/serverless";

export const neonClient = neon(process.env.DATABASE_URL!);
