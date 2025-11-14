import { createPool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from "../shared/dist/schema.js";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "Set POSTGRES_URL (or DATABASE_URL) to connect to your Vercel Postgres database.",
  );
}

export const pool = createPool({
  connectionString,
  // Vercel-managed databases enforce TLS; local development URLs usually disable it via parameters.
  ssl: connectionString.includes("localhost") ? false : undefined,
});

export const db = drizzle(pool, { schema });
