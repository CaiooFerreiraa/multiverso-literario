import { Pool } from "@neondatabase/serverless";

// Use Pool for interactive transactions and RepeatableRead support
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

/**
 * Custom Database type that supports:
 * 1. Tagged templates: database`SELECT...`
 * 2. Interactive transactions: await database.transaction(async (tx) => { ... })
 */
export type Database = {
  <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]>;
  transaction<T>(
    cb: (tx: Database) => Promise<T>,
    options?: { isolationLevel?: "ReadUncommitted" | "ReadCommitted" | "RepeatableRead" | "Serializable" }
  ): Promise<T>;
};

// Create a wrapper that provides the tagged template behavior on top of the Pool
const createDatabaseWrapper = (client: any): Database => {
  const wrapper = (async (strings: TemplateStringsArray, ...values: any[]) => {
    const queryText = strings.reduce((acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ""), "");
    const res = await client.query(queryText, values);
    return res.rows;
  }) as Database;

  wrapper.transaction = async (cb: any, options?: any) => {
    const conn = client.connect ? await client.connect() : client;
    try {
      if (client.connect) await conn.query("BEGIN");
      if (options?.isolationLevel) {
        await conn.query(`SET TRANSACTION ISOLATION LEVEL ${options.isolationLevel.replace(/([A-Z])/g, ' $1').trim()}`);
      }
      const result = await cb(createDatabaseWrapper(conn));
      if (client.connect) await conn.query("COMMIT");
      return result;
    } catch (e) {
      if (client.connect) await conn.query("ROLLBACK");
      throw e;
    } finally {
      if (client.connect) conn.release();
    }
  };

  return wrapper;
};

export const neonClient = createDatabaseWrapper(pool);
