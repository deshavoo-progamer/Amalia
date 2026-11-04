import type { Metadata } from "next";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "إضافة منتج" };

export default async function NewProductPage({ searchParams }: PageProps<"/admin/products/new">) {
    await requireAdmin("/admin/products/new");
    const { audience } = await searchParams;

    return (
        <div>
            <p className="amalia-eyebrow">قطعة جديدة</p>
            <h1 className="mt-3 mb-10 text-4xl">إضافة منتج</h1>
            <ProductForm
                initial={{
                    name: "",
                    audience: audience === "kids" ? "kids" : "women",
                    category: "necklaces",
                    karat: 18,
                    newborn: false,
                    available: true,
                    published: true,
                    featured: false,
                }}
            />
        </div>
    );
}
