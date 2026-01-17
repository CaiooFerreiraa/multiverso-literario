import { neon } from "@neondatabase/serverless";

// Bun automatically loads the DATABASE_URL from .env.local
// Refer to: https://bun.com/docs/runtime/environment-variables for more information
const sql = neon(process.env.DATABASE_URL!);

export default sql;