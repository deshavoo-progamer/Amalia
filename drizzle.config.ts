import { defineConfig } from "drizzle-kit";

// Schema changes go over Neon's direct endpoint; the app itself uses the "-pooler" one.
const url = (process.env.DATABASE_URL ?? "").replace("-pooler.", ".").replace("sslmode=require", "sslmode=verify-full");

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url },
});
