import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";

// Load local env in development (if present)
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local", override: false });
}

// Try Supabase URL first, then fallback to POSTGRES_URL
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
    "https://",
    "postgresql://postgres:postgres@",
  ) + "/postgres";

if (!connectionString) {
  throw new Error(
    "Neither POSTGRES_URL nor NEXT_PUBLIC_SUPABASE_URL is set. Please set one of these environment variables.",
  );
}

console.log(
  "Connecting to database with:",
  connectionString.split("@")[1] || connectionString,
);

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
