import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Custom Database type that supports:
 * 1. Standard query: await database.query('SELECT...', [params])
 * 2. Interactive transactions: await database.transaction(async (tx) => { ... })
 */
export type Database = {
  query<T = any>(text: string, values?: any[]): Promise<T[]>;
  transaction<T>(
    cb: (tx: Database) => Promise<T>,
    options?: { isolationLevel?: "ReadUncommitted" | "ReadCommitted" | "RepeatableRead" | "Serializable" }
  ): Promise<T>;
};

// Create a wrapper that provides the standard query behavior on top of the Pool
const createDatabaseWrapper = (client: any): Database => {
  const wrapper: Database = {
    async query<T = any>(text: string, values?: any[]): Promise<T[]> {
      const res = await client.query(text, values);
      return res.rows;
    },

    async transaction<T>(cb: (tx: Database) => Promise<T>, options?: any): Promise<T> {
      const conn = client.connect ? await client.connect() : client;
      try {
        await conn.query("BEGIN");
        if (options?.isolationLevel) {
          const level = options.isolationLevel.replace(/([A-Z])/g, " $1").trim();
          await conn.query(`SET TRANSACTION ISOLATION LEVEL ${level}`);
        }
        const result = await cb(createDatabaseWrapper(conn));
        await conn.query("COMMIT");
        return result;
      } catch (e) {
        await conn.query("ROLLBACK");
        throw e;
      } finally {
        if (client.connect) conn.release();
      }
    },
  };

  return wrapper;
};

export const neonClient = createDatabaseWrapper(pool);
