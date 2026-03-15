
import { neonClient } from "./src/infrastructure/database/neon/index.ts";

async function check() {
  try {
    const res = await neonClient.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE column_name ILIKE '%created%'
    `);
    console.log("--- COLUMNS WITH 'created' ---");
    for (const r of res) {
      console.log(`${r.table_name}: ${r.column_name}`);
    }
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

check();
