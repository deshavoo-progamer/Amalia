import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";

import ProductTable, { type AdminProductRow } from "@/components/admin/ProductTable";
import { db } from "@/db";
import { product } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "المنتجات" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
    await requireAdmin("/admin/products");
    const { saved, deleted } = await searchParams;

    const rows: AdminProductRow[] = await db
        .select({
            id: product.id,
            slug: product.slug,
            name: product.name,
            code: product.code,
            audience: product.audience,
            category: product.category,
            price: product.price,
            image: product.image,
            available: product.available,
            published: product.published,
            featured: product.featured,
        })
        .from(product)
        .orderBy(asc(product.sortOrder), asc(product.createdAt));

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="amalia-eyebrow">إدارة المتجر</p>
                    <h1 className="mt-3 text-4xl">المنتجات</h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-6 text-sm font-medium text-ivory transition-colors hover:bg-forest-deep"
                >
                    <Plus size={18} strokeWidth={1.5} />
                    إضافة منتج
                </Link>
            </div>

            {(saved || deleted) && (
                <p role="status" className="mt-6 rounded-xl bg-gold/15 px-4 py-3 text-sm text-forest">
                    {saved ? "تم حفظ القطعة وتحديث المتجر." : "تم حذف القطعة من المتجر."}
                </p>
            )}

            <div className="mt-8">
                <ProductTable rows={rows} />
            </div>
        </div>
    );
}
