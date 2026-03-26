import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { orders, products, categories } from "../shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function resetDatabase() {
  console.log("🗑️  Deleting orders...");
  await db.delete(orders);
  console.log("🗑️  Deleting products...");
  await db.delete(products);
  console.log("🗑️  Deleting categories...");
  await db.delete(categories);
  console.log("✅ Done! Restart the server to reseed with new phone data.");
  await pool.end();
}

resetDatabase().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
