import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BadgeCheck, Gem, Truck } from "lucide-react";

import EmailLoginForm from "@/components/auth/EmailLoginForm";
import Emblem from "@/components/brand/Emblem";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/redirect";

export const metadata: Metadata = {
    title: "تسجيل الدخول",
    alternates: { canonical: "/login" },
    robots: { index: false, follow: true },
};

const perks = [
    { icon: Gem, text: "تابعي طلباتك وقطعك المفضلة" },
    { icon: Truck, text: "إتمام أسرع للطلب بعنوانك المحفوظ" },
    { icon: BadgeCheck, text: "بياناتك محمية ولا نشاركها مع أحد" },
];

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
    const redirectTo = safeRedirect((await searchParams).redirect);

    if (await auth.api.getSession({ headers: await headers() })) redirect(redirectTo);

    return (
        <main id="main-content" className="bg-ivory">
            <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-12">
                <section aria-labelledby="login-title" className="mx-auto w-full max-w-md">
                    <Emblem className="size-12" />
                    <p className="amalia-eyebrow mt-8">مرحبًا بكِ</p>
                    <h1 id="login-title" className="mt-3 text-4xl sm:text-5xl">
                        حسابك في أماليا
                    </h1>
                    <p className="mt-4 leading-8 text-forest/70">
                        سجّلي دخولك أو أنشئي حسابك ببريدك الإلكتروني لإتمام طلبك ومتابعته.
                    </p>

                    <div className="mt-10">
                        <EmailLoginForm redirectTo={redirectTo} />
                    </div>

                    <ul className="mt-10 space-y-3 border-t border-forest/10 pt-8 text-sm text-forest/70">
                        {perks.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
                                    <Icon size={16} strokeWidth={1.5} />
                                </span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Desktop: the brand moment beside the form */}
                <div className="relative hidden lg:block">
                    <span aria-hidden="true" className="amalia-arch absolute -inset-4 border border-gold/40" />
                    <div className="amalia-arch relative aspect-4/5 overflow-hidden bg-forest shadow-[0_50px_100px_-40px_rgb(10_33_29/60%)]">
                        <Image
                            src="/images/look-flower-bracelet.webp"
                            alt="إسوارة ذهب رقيقة بزهرة الصدف من أماليا على وسادة مخملية"
                            fill
                            sizes="45vw"
                            className="object-cover"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-forest-deep/70 via-transparent to-transparent" />
                        <p lang="en" className="text-gold-gradient absolute inset-x-0 bottom-10 text-center font-display text-3xl italic">
                            Elegance in every touch
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
