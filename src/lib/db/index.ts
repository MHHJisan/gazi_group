import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";

// Load local env in development (if present)
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local", override: false });
}

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'POSTGRES_URL is not set. Create a .env.local with POSTGRES_URL="postgresql://username:password@localhost:5432/financial_management"',
  );
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
