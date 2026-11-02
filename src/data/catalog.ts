import "server-only";

/**
 * Catalog queries. Products live in the database (managed from /admin); pages are rendered
 * statically and refreshed by `revalidateCatalog()` whenever the admin changes something.
 */
import { cache } from "react";
import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { product as productTable } from "@/db/schema";

import { type Audience, type CategoryKey, type Product } from "./taxonomy";

export * from "./taxonomy";

type Row = typeof productTable.$inferSelect;

const toProduct = (row: Row): Product => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    audience: row.audience,
    category: row.category,
    collections: row.collections,
    price: row.price,
    regularPrice: row.regularPrice,
    available: row.available,
    image: row.image,
    width: row.width,
    height: row.height,
    blur: row.blur,
    cutout: row.cutout ?? undefined,
    code: row.code ?? undefined,
    karat: row.karat ?? undefined,
    weight: row.weight ?? undefined,
    story: row.story ?? undefined,
    care: row.care ?? undefined,
});

/** Every published piece, in the admin's display order. Deduplicated per request/build. */
export const getProducts = cache(async (): Promise<Product[]> => {
    const rows = await db
        .select()
        .from(productTable)
        .where(eq(productTable.published, true))
        .orderBy(asc(productTable.sortOrder), asc(productTable.createdAt));
    return rows.map(toProduct);
});

const isAudience = (key: CategoryKey): key is Audience => key === "women" || key === "kids";

export async function getProductsByCategory(key: CategoryKey) {
    const products = await getProducts();
    if (key === "newborn") return products.filter((product) => product.collections.includes("newborn"));
    if (isAudience(key)) return products.filter((product) => product.audience === key);
    return products.filter((product) => product.category === key);
}

/** Listings that currently have pieces — empty ones stay out of the sitemap and search engines. */
export async function hasProducts(key: CategoryKey) {
    return (await getProductsByCategory(key)).length > 0;
}

export async function getProduct(slug: string) {
    return (await getProducts()).find((product) => product.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 4) {
    return (await getProducts())
        .filter(
            (item) =>
                item.category === product.category &&
                item.audience === product.audience &&
                item.id !== product.id &&
                item.available
        )
        .slice(0, limit);
}

/** The home "boutique" showcase. */
export const getFeaturedProducts = cache(async (limit = 5): Promise<Product[]> => {
    const rows = await db
        .select()
        .from(productTable)
        .where(and(eq(productTable.published, true), eq(productTable.featured, true)))
        .orderBy(asc(productTable.sortOrder))
        .limit(limit);
    return rows.map(toProduct);
});

/** Most recent catalog change, for the sitemap's lastModified. */
export async function getCatalogUpdatedAt() {
    const [row] = await db.select({ value: sql<Date>`max(${productTable.updatedAt})` }).from(productTable);
    return row?.value ? new Date(row.value) : new Date();
}
