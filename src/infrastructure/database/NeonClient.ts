import { neon } from "@neondatabase/serverless";

export const database = neon(process.env.DATABASE_URL!)