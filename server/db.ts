import { createPool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from "../shared/schema.js";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Set POSTGRES_URL or POSTGRES_URL_NON_POOLING to connect to Vercel Postgres."
  );
}

export const pool = createPool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : undefined,
});

export const db = drizzle(pool, { schema });
