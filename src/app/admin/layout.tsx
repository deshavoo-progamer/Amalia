import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, Package, Plus } from "lucide-react";

import BabyWordmark from "@/components/brand/BabyWordmark";
import SignOutButton from "@/components/auth/SignOutButton";
import { requireAdmin } from "@/lib/admin";
import { signInIdentity } from "@/lib/auth";

export const metadata: Metadata = {
    title: { default: "لوحة التحكم", template: "%s | لوحة تحكم بيبي أماليا" },
    robots: { index: false, follow: false },
};

const links = [
    { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/admin/products", label: "المنتجات", icon: Package },
    { href: "/admin/products/new", label: "إضافة منتج", icon: Plus },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
    const session = await requireAdmin();
    const identity = signInIdentity(session.user);

    return (
        <div className="flex min-h-dvh flex-col bg-ivory-warm lg:flex-row">
            <aside className="bg-forest-deep text-ivory lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0">
                <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block lg:px-7 lg:py-8">
                    <Link href="/admin" className="block text-ivory">
                        <BabyWordmark className="w-32 lg:w-40" />
                        <span className="mt-1 block text-[11px] tracking-[0.2em] text-gold">ADMIN</span>
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex h-11 items-center gap-2 text-sm text-ivory/70 transition-colors hover:text-gold-light lg:mt-6"
                    >
                        <ExternalLink size={16} strokeWidth={1.5} />
                        عرض المتجر
                    </Link>
                </div>

                <nav aria-label="قائمة لوحة التحكم" className="overflow-x-auto px-3 pb-3 lg:px-4 lg:pb-0">
                    <ul className="flex gap-1 lg:flex-col">
                        {links.map(({ href, label, icon: Icon }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="flex h-11 items-center gap-3 rounded-xl px-4 text-sm whitespace-nowrap text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory"
                                >
                                    <Icon size={18} strokeWidth={1.5} className="text-gold" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="hidden border-t border-ivory/10 px-7 py-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
                    <p className="text-xs text-ivory/60">مسجّل باسم</p>
                    <p dir="ltr" className="mt-1 text-end text-sm break-all text-ivory tabular-nums">
                        {identity.value}
                    </p>
                </div>
            </aside>

            <main id="main-content" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
                {children}
                <div className="mt-16 border-t border-forest/10 pt-6 lg:hidden">
                    <SignOutButton />
                </div>
            </main>
        </div>
    );
}
