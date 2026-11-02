/**
 * Database schema (PostgreSQL via Drizzle).
 * The four auth tables follow Better Auth's core model; `user` adds the phone-number plugin
 * fields and `rateLimit` backs the OTP rate limiter on serverless hosting.
 */
import { sql } from "drizzle-orm";
import { bigint, boolean, doublePrecision, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    phoneNumber: text("phone_number").unique(),
    phoneNumberVerified: boolean("phone_number_verified"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** The catalog. Managed from /admin; the storefront reads it at build/revalidation time. */
export const product = pgTable(
    "product",
    {
        id: text("id").primaryKey(),
        slug: text("slug").notNull().unique(),
        name: text("name").notNull(),
        audience: text("audience", { enum: ["women", "kids"] }).notNull(),
        category: text("category", { enum: ["earrings", "necklaces", "bracelets"] }).notNull(),
        collections: text("collections").array().notNull().default(sql`'{}'::text[]`),
        price: integer("price").notNull(),
        regularPrice: integer("regular_price").notNull(),
        available: boolean("available").notNull().default(true),
        published: boolean("published").notNull().default(true),
        featured: boolean("featured").notNull().default(false),
        sortOrder: integer("sort_order").notNull().default(0),
        image: text("image").notNull(),
        width: integer("width").notNull(),
        height: integer("height").notNull(),
        blur: text("blur").notNull(),
        cutout: text("cutout"),
        code: text("code"),
        karat: integer("karat"),
        weight: doublePrecision("weight"),
        story: text("story"),
        care: text("care"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
    },
    (table) => [index("product_listing_idx").on(table.published, table.audience, table.category)]
);

export const rateLimit = pgTable("rate_limit", {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    count: integer("count").notNull(),
    lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});
