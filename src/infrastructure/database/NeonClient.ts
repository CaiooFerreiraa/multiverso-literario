import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export const database = neon(process.env.DATABASE_URL!)