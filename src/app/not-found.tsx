import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MagneticLink from "@/components/ui/MagneticLink";
import { categories } from "@/data/taxonomy";

export const metadata: Metadata = {
    title: "الصفحة غير موجودة",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main
                id="main-content"
                className="amalia-wall grain relative isolate flex flex-1 items-center overflow-hidden py-24 text-ivory sm:py-32"
            >
                <div className="mx-auto max-w-2xl px-4 text-center">
                    <Emblem className="mx-auto size-16" />
                    <p lang="en" className="mt-8 font-display text-2xl text-gold italic">
                        404
                    </p>
                    <h1 className="mt-3 text-3xl sm:text-4xl">
                        هذه القطعة لم تعد في مكانها
                    </h1>
                    <p className="mt-5 text-base leading-8 text-ivory/65 sm:text-lg">
                        ربما تغيّر الرابط أو نفدت القطعة. تجولي في البوتيك واكتشفي ما يناسبكِ ويناسب صغيرتك.
                    </p>

                    <div className="mt-10 flex justify-center">
                        <MagneticLink href="/shop" variant="gold">
                            ادخلي البوتيك
                            <ArrowLeft size={18} strokeWidth={1.5} />
                        </MagneticLink>
                    </div>

                    <nav aria-label="تصنيفات المتجر" className="mt-10">
                        <ul className="flex flex-wrap justify-center gap-2">
                            {categories.map((category) => (
                                <li key={category.key}>
                                    <Link
                                        href={`/shop/${category.key}`}
                                        className="inline-flex h-10 items-center rounded-full border border-ivory/20 px-4 text-sm text-ivory/80 transition-colors hover:border-gold hover:text-gold-light"
                                    >
                                        {category.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </main>
            <Footer />
        </>
    );
}
