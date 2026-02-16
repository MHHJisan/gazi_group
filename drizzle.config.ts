import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

// Try Supabase URL first, then fallback to POSTGRES_URL
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
    "https://",
    "postgresql://postgres:postgres@",
  ) + "/postgres";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString!,
  },
});
