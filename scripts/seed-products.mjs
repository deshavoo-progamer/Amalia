/**
 * One-time move of the original catalog (src/data/products.json) into the `product` table.
 *
 *   npm run db:seed
 *
 * Safe to re-run: existing ids are left untouched, so edits made in /admin are never overwritten.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const ROOT = path.resolve(import.meta.dirname, "..");

// Shown in the home "boutique" showcase, in this order.
const FEATURED_IDS = ["1977358123", "1427744683", "1742803344", "611097464", "895907754"];

const { products } = JSON.parse(await readFile(path.join(ROOT, "src/data/products.json"), "utf8"));
const client = new pg.Client({
    connectionString: (process.env.DATABASE_URL ?? "").replace("sslmode=require", "sslmode=verify-full"),
});
await client.connect();

let inserted = 0;
for (const [index, product] of products.entries()) {
    const featuredAt = FEATURED_IDS.indexOf(product.id);
    const result = await client.query(
        `insert into product (
            id, slug, name, audience, category, collections, price, regular_price, available, published,
            featured, sort_order, image, width, height, blur, cutout, code, karat, weight, story, care
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        on conflict (id) do nothing`,
        [
            product.id,
            product.slug,
            product.name,
            product.audience,
            product.category,
            product.collections,
            product.price,
            product.regularPrice,
            product.available,
            featuredAt >= 0,
            featuredAt >= 0 ? featuredAt : 100 + index,
            product.image,
            product.width,
            product.height,
            product.blur,
            product.cutout ?? null,
            product.code ?? null,
            product.karat ?? null,
            product.weight ?? null,
            product.story ?? null,
            product.care ?? null,
        ]
    );
    inserted += result.rowCount;
}

console.log(`Seeded ${inserted} new products (${products.length - inserted} already present).`);
await client.end();
