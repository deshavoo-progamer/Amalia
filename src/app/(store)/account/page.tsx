import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard, Mail, Package, ShoppingBag, Smartphone } from "lucide-react";

import SignOutButton from "@/components/auth/SignOutButton";
import PageHeader from "@/components/ui/PageHeader";
import { isAdmin } from "@/lib/admin";
import { auth, signInIdentity } from "@/lib/auth";

export const metadata: Metadata = {
    title: "حسابي",
    alternates: { canonical: "/account" },
    robots: { index: false, follow: false },
};

export default async function AccountPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login?redirect=/account");

    const identity = signInIdentity(session.user);
    const IdentityIcon = identity.kind === "phone" ? Smartphone : Mail;

    return (
        <main id="main-content">
            <PageHeader
                eyebrow="My Account"
                title="حسابي"
                description="أهلًا بكِ من جديد. من هنا تتابعين طلباتك وتديرين بيانات حسابك."
                breadcrumbs={[{ label: "حسابي", href: "/account" }]}
            />

            <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-12 sm:px-8 sm:py-16 md:grid-cols-3 lg:px-12">
                <section className="rounded-[1.5rem] border border-forest/10 bg-white/60 p-6 sm:p-8">
                    <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold-deep">
                        <IdentityIcon size={20} strokeWidth={1.5} />
                    </span>
                    <h2 className="mt-5 text-2xl">بيانات الدخول</h2>
                    <p className="mt-2 text-sm text-forest/70">
                        {identity.kind === "phone" ? "رقم الجوال المسجّل" : "البريد الإلكتروني المسجّل"}
                    </p>
                    <p dir="ltr" className="mt-1 text-end text-lg font-medium break-all text-forest tabular-nums">
                        {identity.value}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {isAdmin(session.user) && (
                            <Link
                                href="/admin"
                                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-6 text-sm font-medium text-ivory transition-colors hover:bg-forest-deep"
                            >
                                <LayoutDashboard size={16} strokeWidth={1.5} />
                                لوحة التحكم
                            </Link>
                        )}
                        <SignOutButton />
                    </div>
                </section>

                <section className="rounded-[1.5rem] border border-forest/10 bg-white/60 p-6 sm:p-8">
                    <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold-deep">
                        <Package size={20} strokeWidth={1.5} />
                    </span>
                    <h2 className="mt-5 text-2xl">طلباتي</h2>
                    <p className="mt-2 text-sm leading-7 text-forest/70">
                        ستظهر طلباتك وحالة شحنها هنا فور تفعيل الدفع الإلكتروني.
                    </p>
                </section>

                <section className="grain relative overflow-hidden rounded-[1.5rem] bg-forest-deep p-6 text-ivory sm:p-8">
                    <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                    </span>
                    <h2 className="mt-5 text-2xl">حقيبة التسوق</h2>
                    <p className="mt-2 text-sm leading-7 text-ivory/70">أكملي طلبك من القطع التي اخترتها.</p>
                    <Link
                        href="/cart"
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 text-sm font-medium text-forest-deep transition-colors hover:bg-gold-light"
                    >
                        عرض الحقيبة
                        <ArrowLeft size={16} strokeWidth={1.5} />
                    </Link>
                </section>
            </div>
        </main>
    );
}
