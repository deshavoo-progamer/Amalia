import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

/**
 * Neon links use sslmode=require; pg is changing what that means, so the stronger,
 * explicit verify-full (full certificate check) is used instead.
 */
function databaseUrl(raw = process.env.DATABASE_URL) {
    if (!raw) return raw;
    try {
        const url = new URL(raw);
        if (url.searchParams.get("sslmode") === "require") url.searchParams.set("sslmode", "verify-full");
        return url.toString();
    } catch {
        return raw;
    }
}

const connectionString = databaseUrl();

// One pool per server instance, reused across dev hot reloads — but rebuilt when
// DATABASE_URL changes, so editing .env.local takes effect without a restart.
const globalForDb = globalThis as unknown as { amaliaPool?: Pool; amaliaPoolUrl?: string };

if (globalForDb.amaliaPool && globalForDb.amaliaPoolUrl !== connectionString) {
    void globalForDb.amaliaPool.end();
    globalForDb.amaliaPool = undefined;
}

const pool = globalForDb.amaliaPool ?? new Pool({ connectionString, max: 5 });

if (process.env.NODE_ENV !== "production") {
    globalForDb.amaliaPool = pool;
    globalForDb.amaliaPoolUrl = connectionString;
}

export const db = drizzle(pool, { schema });
