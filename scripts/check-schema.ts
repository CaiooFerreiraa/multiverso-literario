import { neonClient } from "./src/infrastructure/database/neon/index";

async function checkSchema() {
  const result = await neonClient.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name IN ('questions', 'alternatives', 'quiz')
    ORDER BY table_name, ordinal_position;
  `);
  console.log(JSON.stringify(result, null, 2));
}

checkSchema().catch(console.error);
