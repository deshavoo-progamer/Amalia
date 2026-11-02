import Link from "next/link";
import { sql } from "drizzle-orm";
import { ArrowLeft, Plus } from "lucide-react";

import { db } from "@/db";
import { product } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export default async function AdminHome() {
    await requireAdmin();

    const [stats] = await db
        .select({
            total: sql<number>`count(*)::int`,
            women: sql<number>`count(*) filter (where ${product.audience} = 'women')::int`,
            kids: sql<number>`count(*) filter (where ${product.audience} = 'kids')::int`,
            soldOut: sql<number>`count(*) filter (where not ${product.available})::int`,
            hidden: sql<number>`count(*) filter (where not ${product.published})::int`,
        })
        .from(product);

    const cards = [
        { label: "كل المنتجات", value: stats.total },
        { label: "للنساء", value: stats.women },
        { label: "للأطفال", value: stats.kids },
        { label: "نفدت الكمية", value: stats.soldOut },
        { label: "مخفية عن المتجر", value: stats.hidden },
    ];

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p className="amalia-eyebrow">Overview</p>
                    <h1 className="mt-3 text-4xl">نظرة عامة</h1>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-6 text-sm font-medium text-ivory transition-colors hover:bg-forest-deep"
                >
                    <Plus size={18} strokeWidth={1.5} />
                    إضافة منتج
                </Link>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                {cards.map((card) => (
                    <li key={card.label} className="rounded-2xl border border-forest/10 bg-white p-6">
                        <p className="text-sm text-forest/70">{card.label}</p>
                        <p className="mt-2 text-3xl font-medium text-forest tabular-nums">{card.value}</p>
                    </li>
                ))}
            </ul>

            {stats.women === 0 && (
                <div className="mt-8 rounded-2xl bg-forest-deep p-6 text-ivory sm:p-8">
                    <h2 className="text-2xl">قسم النساء جاهز لأول قطعة</h2>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-ivory/70">
                        صفحة «للنساء» تعرض «قريبًا» ومخفية عن محركات البحث حتى تضيفي أول قطعة نسائية، فتظهر تلقائيًا.
                    </p>
                    <Link
                        href="/admin/products/new?audience=women"
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 text-sm font-medium text-forest-deep transition-colors hover:bg-gold-light"
                    >
                        إضافة قطعة نسائية
                        <ArrowLeft size={16} strokeWidth={1.5} />
                    </Link>
                </div>
            )}
        </div>
    );
}
