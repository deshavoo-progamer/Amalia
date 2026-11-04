import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";

import ProductForm from "@/components/admin/ProductForm";
import { db } from "@/db";
import { product } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "تعديل منتج" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
    const { id } = await params;
    await requireAdmin(`/admin/products/${id}`);

    const [row] = await db.select().from(product).where(eq(product.id, id)).limit(1);
    if (!row) notFound();

    return (
        <div>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="amalia-eyebrow">تعديل قطعة</p>
                    <h1 className="mt-3 text-4xl">{row.name}</h1>
                </div>
                {row.published && (
                    <Link
                        href={`/product/${row.slug}`}
                        target="_blank"
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-gold-ink hover:text-forest"
                    >
                        <ExternalLink size={16} strokeWidth={1.5} />
                        عرضها في المتجر
                    </Link>
                )}
            </div>
            <ProductForm
                initial={{
                    id: row.id,
                    name: row.name,
                    audience: row.audience,
                    category: row.category,
                    price: row.price,
                    karat: row.karat,
                    weight: row.weight,
                    code: row.code,
                    story: row.story,
                    care: row.care,
                    newborn: row.collections.includes("newborn"),
                    available: row.available,
                    published: row.published,
                    featured: row.featured,
                    image: row.image,
                    cutout: row.cutout,
                }}
            />
        </div>
    );
}
