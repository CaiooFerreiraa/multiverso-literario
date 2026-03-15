
import { readUsersAction } from "./src/actions/admin/index.ts";

async function test() {
  const res = await readUsersAction(1, 10);
  console.log("Result:", JSON.stringify(res, null, 2));
  process.exit(0);
}

test();
