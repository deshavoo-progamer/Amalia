import type { MetadataRoute } from "next";

import { categories, getCatalogUpdatedAt, getProducts, hasProducts } from "@/data/catalog";
import { contentPages } from "@/data/pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, lastModified] = await Promise.all([getProducts(), getCatalogUpdatedAt()]);
    const listed = await Promise.all(categories.map(async (category) => ((await hasProducts(category.key)) ? category : null)));

    return [
        {
            // Matches the canonical Next.js renders for "/" (no trailing slash).
            url: siteConfig.url,
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
            images: [absoluteUrl("/opengraph-image.jpg")],
        },
        {
            url: absoluteUrl("/shop"),
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...listed.filter((category) => category !== null).map((category) => ({
            url: absoluteUrl(`/shop/${category.key}`),
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.8,
            images: category.image ? [absoluteUrl(category.image)] : undefined,
        })),
        ...products.map((product) => ({
            url: absoluteUrl(`/product/${product.slug}`),
            lastModified,
            changeFrequency: "weekly" as const,
            priority: 0.7,
            images: [absoluteUrl(product.image)],
        })),
        { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.4 },
        ...contentPages.map((page) => ({
            url: absoluteUrl(`/${page.slug}`),
            lastModified,
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),
    ];
}
