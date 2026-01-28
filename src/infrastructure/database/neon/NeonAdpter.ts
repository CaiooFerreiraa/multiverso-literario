import { neon } from "@neondatabase/serverless";
import type { Database } from "../../../core/database/Database";

const client = neon(process.env.DATABASE_URL!);

export const database: Database = async <
  T extends Record<string, any>
>(
  strings: TemplateStringsArray,
  ...values: any[]
) => {
  return client(strings, ...values) as Promise<T[]>;
};
