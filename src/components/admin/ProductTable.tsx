"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";

import { setProductFlag } from "@/app/admin/products/actions";
import { categories } from "@/data/taxonomy";
import { cn, formatPrice } from "@/lib/cn";

export type AdminProductRow = {
    id: string;
    slug: string;
    name: string;
    code: string | null;
    audience: "women" | "kids";
    category: "earrings" | "necklaces" | "bracelets";
    price: number;
    image: string;
    available: boolean;
    published: boolean;
    featured: boolean;
};

type Flag = "available" | "published" | "featured";

const FLAGS: { key: Flag; label: string }[] = [
    { key: "available", label: "متوفر" },
    { key: "published", label: "ظاهر" },
    { key: "featured", label: "مميز" },
];

const title = (key: string) => categories.find((category) => category.key === key)?.title ?? key;

export default function ProductTable({ rows }: { rows: AdminProductRow[] }) {
    const [query, setQuery] = useState("");
    const [audience, setAudience] = useState<"all" | "women" | "kids">("all");
    const [overrides, setOverrides] = useState<Record<string, Partial<Record<Flag, boolean>>>>({});
    const [pending, startTransition] = useTransition();

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        return rows.filter(
            (row) =>
                (audience === "all" || row.audience === audience) &&
                (!term || row.name.toLowerCase().includes(term) || row.code?.toLowerCase().includes(term))
        );
    }, [rows, query, audience]);

    function toggle(row: AdminProductRow, flag: Flag) {
        const next = !(overrides[row.id]?.[flag] ?? row[flag]);
        setOverrides((current) => ({ ...current, [row.id]: { ...current[row.id], [flag]: next } }));
        startTransition(async () => {
            try {
                await setProductFlag(row.id, flag, next);
            } catch {
                setOverrides((current) => ({ ...current, [row.id]: { ...current[row.id], [flag]: !next } }));
            }
        });
    }

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3">
                <label className="relative flex min-w-64 flex-1 items-center gap-3 rounded-full border border-forest/15 bg-white px-4">
                    <Search size={18} strokeWidth={1.5} className="text-gold-deep" aria-hidden="true" />
                    <span className="sr-only">ابحثي في المنتجات</span>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="ابحثي بالاسم أو الرمز…"
                        className="h-11 min-w-0 flex-1 bg-transparent text-sm text-forest outline-none placeholder:text-forest/45"
                    />
                </label>
                <div role="group" aria-label="الفئة" className="flex rounded-full border border-forest/15 bg-white p-1">
                    {(["all", "women", "kids"] as const).map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setAudience(value)}
                            aria-pressed={audience === value}
                            className={cn(
                                "h-9 rounded-full px-4 text-sm transition-colors",
                                audience === value ? "bg-forest text-ivory" : "text-forest/70 hover:text-forest"
                            )}
                        >
                            {value === "all" ? "الكل" : value === "women" ? "للنساء" : "للأطفال"}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-forest/70" aria-live="polite">
                    {visible.length} منتج{pending && " · جارٍ الحفظ…"}
                </p>
            </div>

            {/* relative: keeps the sr-only (absolute) labels inside the scroller instead of widening the page. */}
            <div className="relative mt-6 overflow-x-auto rounded-2xl border border-forest/10 bg-white">
                <table className="w-full min-w-184 text-sm">
                    <thead className="border-b border-forest/10 bg-ivory text-start text-xs text-forest/70">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-start font-medium">القطعة</th>
                            <th scope="col" className="px-4 py-3 text-start font-medium">الفئة</th>
                            <th scope="col" className="px-4 py-3 text-start font-medium">السعر</th>
                            {FLAGS.map((flag) => (
                                <th key={flag.key} scope="col" className="px-4 py-3 text-center font-medium">
                                    {flag.label}
                                </th>
                            ))}
                            <th scope="col" className="px-4 py-3"><span className="sr-only">تعديل</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-forest/10">
                        {visible.map((row) => (
                            <tr key={row.id} className="hover:bg-ivory/60">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-ivory">
                                            <Image src={row.image} alt="" fill sizes="48px" className="object-cover" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-forest">{row.name}</span>
                                            {row.code && <span dir="ltr" className="block text-end text-xs text-forest/60">{row.code}</span>}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-forest/80">
                                    {row.audience === "women" ? "للنساء" : "للأطفال"} · {title(row.category)}
                                </td>
                                <td className="px-4 py-3 text-forest tabular-nums">{formatPrice(row.price)}</td>
                                {FLAGS.map((flag) => {
                                    const on = overrides[row.id]?.[flag.key] ?? row[flag.key];
                                    return (
                                        <td key={flag.key} className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={on}
                                                aria-label={`${flag.label}: ${row.name}`}
                                                onClick={() => toggle(row, flag.key)}
                                                className={cn(
                                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                                    on ? "bg-forest" : "bg-forest/20"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "absolute size-5 rounded-full bg-white shadow transition-[inset-inline-start]",
                                                        on ? "inset-s-5.5" : "inset-s-0.5"
                                                    )}
                                                />
                                            </button>
                                        </td>
                                    );
                                })}
                                <td className="px-4 py-3 text-end">
                                    <Link
                                        href={`/admin/products/${row.id}`}
                                        aria-label={`تعديل ${row.name}`}
                                        className="inline-grid size-11 place-items-center rounded-full text-forest/70 transition-colors hover:bg-ivory hover:text-forest"
                                    >
                                        <Pencil size={16} strokeWidth={1.5} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {visible.length === 0 && <p className="px-4 py-10 text-center text-sm text-forest/70">لا توجد منتجات مطابقة.</p>}
            </div>
        </div>
    );
}
