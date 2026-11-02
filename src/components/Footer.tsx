import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import BabyWordmark from "@/components/brand/BabyWordmark";
import Emblem from "@/components/brand/Emblem";
import { contactWhatsappUrl, siteConfig } from "@/lib/site";

const footerColumns = [
    {
        title: "تسوقي",
        links: [
            { label: "جميع المجوهرات", href: "/shop" },
            { label: "للنساء", href: "/shop/women" },
            { label: "للأطفال", href: "/shop/kids" },
            { label: "أقراط", href: "/shop/earrings" },
            { label: "قلائد", href: "/shop/necklaces" },
            { label: "أساور", href: "/shop/bracelets" },
            { label: "أقراط المواليد", href: "/shop/newborn" },
        ],
    },
    {
        title: "بيبي أماليا",
        links: [
            { label: "من نحن", href: "/about" },
            { label: "العناية بالمجوهرات", href: "/care" },
            { label: "فن الإهداء", href: "/#gifts" },
            { label: "تواصلي معنا", href: "/contact" },
        ],
    },
    {
        title: "خدمة العملاء",
        links: [
            { label: "الشحن والتوصيل", href: "/shipping" },
            { label: "سياسة الاستبدال", href: "/returns" },
            { label: "الشروط والأحكام", href: "/terms" },
            { label: "سياسة الخصوصية", href: "/privacy" },
        ],
    },
];

const socialLinks = [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "TikTok", href: siteConfig.social.tiktok },
    { label: "Snapchat", href: siteConfig.social.snapchat },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="grain relative overflow-hidden bg-forest-deep text-ivory">
            <div className="mx-auto max-w-[1600px] px-4 pt-20 pb-10 sm:px-8 lg:px-12">
                <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
                    <div>
                        <Link
                            href="/"
                            aria-label={`${siteConfig.nameEn} - الصفحة الرئيسية`}
                            className="group inline-flex flex-col items-start gap-5"
                        >
                            <Emblem className="size-12 transition-transform duration-1000 ease-luxe group-hover:rotate-180" />
                            <BabyWordmark className="w-64 text-ivory" />
                        </Link>
                        <p
                            lang="en"
                            className="text-gold-gradient mt-3 font-display text-xl italic"
                        >
                            {siteConfig.tagline}
                        </p>
                        <p className="mt-6 max-w-sm leading-8 text-ivory/60">
                            مجوهرات ذهب عيار 18 لكِ ولصغيرتك، بحرفية أوروبية
                            وأناقة تنتقل من جيل إلى جيل.
                        </p>

                        <ul className="mt-8 space-y-3 text-sm">
                            <li>
                                <a
                                    href={contactWhatsappUrl}
                                    className="amalia-footer-link inline-flex items-center gap-3 text-ivory/75"
                                >
                                    <MessageCircle size={17} strokeWidth={1.5} className="text-gold" />
                                    واتساب
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${siteConfig.contact.phone}`}
                                    className="amalia-footer-link inline-flex items-center gap-3 text-ivory/75"
                                >
                                    <Phone size={17} strokeWidth={1.5} className="text-gold" />
                                    <span dir="ltr">{siteConfig.contact.phone}</span>
                                </a>
                            </li>
                        </ul>

                        <ul className="mt-6 flex flex-wrap gap-3" aria-label="حساباتنا على التواصل الاجتماعي">
                            {socialLinks.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        lang="en"
                                        className="inline-flex h-10 items-center rounded-full border border-ivory/15 px-4 font-display text-base text-ivory/75 italic transition-colors hover:border-gold hover:text-gold-light"
                                    >
                                        {social.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <nav
                        aria-label="روابط التذييل"
                        className="grid grid-cols-2 gap-10 sm:grid-cols-3"
                    >
                        {footerColumns.map((column) => (
                            <div key={column.title}>
                                <h2 className="font-sans text-sm font-medium tracking-wide text-gold">
                                    {column.title}
                                </h2>
                                <ul className="mt-5 space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.href + link.label}>
                                            <Link
                                                href={link.href}
                                                className="amalia-footer-link text-sm text-ivory/65"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Oversized wordmark */}
                <div
                    aria-hidden="true"
                    className="amalia-footer-giant mt-20 text-ivory/6"
                >
                    <BabyWordmark className="w-full" />
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/60 sm:flex-row">
                    <p>
                        © {year} {siteConfig.name} | {siteConfig.nameEn}. جميع الحقوق محفوظة.
                    </p>
                    <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <span>موثّق في منصة الأعمال</span>
                        <span aria-hidden="true" className="text-gold">✦</span>
                        <span lang="en" dir="ltr">
                            {siteConfig.payments.join(" · ")}
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
