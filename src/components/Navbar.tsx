"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "motion/react";

import {
    ArrowLeft,
    ChevronDown,
    Menu,
    MessageCircle,
    Search,
    ShoppingBag,
    UserRound,
    X,
} from "lucide-react";

import Wordmark from "@/components/brand/Wordmark";
import { useCart } from "@/lib/cart";
import { contactWhatsappUrl } from "@/lib/site";

const mainLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "للنساء", href: "/shop/women" },
    { label: "للأطفال", href: "/shop/kids" },
    { label: "قصتنا", href: "/about" },
    { label: "تواصلي معنا", href: "/contact" },
];

const categoryLinks = [
    { label: "جميع المجوهرات", href: "/shop" },
    { label: "للنساء", href: "/shop/women" },
    { label: "للأطفال", href: "/shop/kids" },
    { label: "أقراط", href: "/shop/earrings" },
    { label: "قلائد", href: "/shop/necklaces" },
    { label: "أساور", href: "/shop/bracelets" },
    { label: "أقراط المواليد", href: "/shop/newborn" },
];

const iconLinks = [
    {
        label: "البحث",
        href: "/search",
        icon: Search,
    },
    {
        label: "واتساب",
        href: contactWhatsappUrl,
        icon: MessageCircle,
    },
    {
        label: "حسابي",
        href: "/account",
        icon: UserRound,
    },
    {
        label: "حقيبة التسوق",
        href: "/cart",
        icon: ShoppingBag,
    },
];

// The announcement bar always shows within this distance of the page top.
const BAR_TOP_ZONE = 48;
// Scroll movement below this is ignored, so small finger jitter doesn't flicker the bar.
const BAR_SCROLL_DELTA = 8;

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { count } = useCart();
    // Anchors ("/#gifts") never mark a page as current.
    const current = (href: string) => (!href.includes("#") && href === pathname ? "page" : undefined);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [barOffset, setBarOffset] = useState(0);
    const announcementRef = useRef<HTMLDivElement>(null);

    const shouldReduceMotion = useReducedMotion();

    // Scrolling down slides the header up by the bar's height; scrolling up brings it back.
    // A transform, not a collapse: the page layout never changes, so nothing jumps mid-scroll.
    useEffect(() => {
        let lastY = window.scrollY;

        function handleScroll() {
            const y = window.scrollY;

            if (y < BAR_TOP_ZONE) {
                lastY = y;
                setBarOffset(0);
                return;
            }

            if (Math.abs(y - lastY) < BAR_SCROLL_DELTA) return;

            setBarOffset(y > lastY ? (announcementRef.current?.offsetHeight ?? 0) : 0);
            lastY = y;
        }

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen && !searchOpen) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMobileMenuOpen(false);
                setSearchOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileMenuOpen, searchOpen]);

    function closeMobileMenu() {
        setMobileMenuOpen(false);
        setCategoriesOpen(false);
    }

    function handleSearchSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const query = searchQuery.trim();

        if (!query) return;

        setSearchOpen(false);

        router.push(`/search?q=${encodeURIComponent(query)}`);
    }

    return (
        <>
            <header
                dir="rtl"
                className="amalia-header sticky top-0 z-50 w-full transition-[translate] duration-300 ease-out motion-reduce:transition-none"
                style={barOffset ? { translate: `0 -${barOffset}px` } : undefined}
            >
                <div ref={announcementRef} className="amalia-announcement">
                    <div className="mx-auto flex min-h-9 max-w-[1600px] items-center justify-center px-4">
                        <p className="text-center text-[10px] font-medium tracking-[0.12em] sm:text-xs">
                            شحن لجميع مناطق المملكة خلال 3–5 أيام
                            <span className="mx-2 text-gold">✦</span>
                            ذهب عيار 18 لكِ ولصغيرتك
                        </p>
                    </div>
                </div>

                {/* Main navigation */}
                <div className="border-b border-forest/10 bg-ivory">
                    <div className="mx-auto grid h-19 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-22 sm:px-8 lg:px-12">
                        {/* Mobile menu and search */}
                        <div className="flex items-center justify-start gap-1 sm:gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="فتح قائمة التنقل"
                                aria-expanded={mobileMenuOpen}
                                aria-controls="amalia-mobile-menu"
                                className="amalia-icon-button"
                            >
                                <Menu size={22} strokeWidth={1.5} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                aria-label="البحث"
                                className="amalia-icon-button"
                            >
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Desktop main links */}
                        <nav
                            aria-label="التنقل الرئيسي"
                            className="hidden items-center justify-start gap-5 lg:flex xl:gap-8"
                        >
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    aria-current={current(link.href)}
                                    className="amalia-nav-link"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Brand */}
                        <Link
                            href="/"
                            className="amalia-brand group flex flex-col items-center justify-center"
                        >
                            <span className="sr-only">Amalia Jewellery — الصفحة الرئيسية</span>
                            <Wordmark className="amalia-brand-name w-40 sm:w-52 lg:w-60" />
                        </Link>

                        {/* Action icons */}
                        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                            {iconLinks.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-label={href === "/cart" && count > 0 ? `${label} (${count})` : label}
                                    className={`amalia-icon-button relative ${href === "/search" ? "hidden lg:inline-flex" : ""
                                        } ${label === "واتساب" || label === "حسابي" ? "hidden sm:inline-flex" : ""
                                        }`}
                                >
                                    <Icon size={20} strokeWidth={1.5} />
                                    {href === "/cart" && count > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] leading-5 font-medium text-forest-deep tabular-nums"
                                        >
                                            {count}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category navigation */}
                <div className="hidden border-b border-forest/10 bg-ivory lg:block">
                    <nav
                        aria-label="تصنيفات المجوهرات"
                        className="mx-auto flex h-12 max-w-[1600px] items-center justify-center gap-8 px-8 xl:gap-12"
                    >
                        {categoryLinks.map((category) => (
                            <Link
                                key={category.href + category.label}
                                href={category.href}
                                aria-current={current(category.href)}
                                className="amalia-category-link"
                            >
                                {category.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Search panel */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.2,
                        }}
                        className="fixed inset-0 z-70 flex items-start justify-center bg-forest/60 px-4 pt-[12vh] backdrop-blur-sm"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                setSearchOpen(false);
                            }
                        }}
                    >
                        <motion.div
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : { opacity: 0, y: -16 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.2,
                            }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="amalia-search-title"
                            className="w-full max-w-2xl bg-ivory p-5 shadow-2xl sm:p-9"
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <h2
                                    id="amalia-search-title"
                                    className="text-xl text-forest sm:text-2xl"
                                >
                                    ابحثي عن قطعتك المفضلة
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    aria-label="إغلاق البحث"
                                    className="amalia-icon-button"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center gap-3 border-b border-forest/30 pb-3"
                            >
                                <Search
                                    size={21}
                                    className="shrink-0 text-gold"
                                />

                                <input
                                    autoFocus
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="ابحثي عن أقراط، سلسال، أو هدية مواليد..."
                                    aria-label="اكتبي اسم المنتج"
                                    className="min-w-0 flex-1 bg-transparent py-2 text-sm text-forest outline-none placeholder:text-forest/50 sm:text-base"
                                />

                                <button
                                    type="submit"
                                    disabled={!searchQuery.trim()}
                                    className="flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    بحث
                                    <ArrowLeft size={17} />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile navigation drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="إغلاق قائمة التنقل"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.2,
                            }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 z-60 cursor-default bg-forest/55 backdrop-blur-sm"
                        />

                        <motion.aside
                            id="amalia-mobile-menu"
                            initial={
                                shouldReduceMotion
                                    ? false
                                    : { x: "100%" }
                            }
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.28,
                                ease: "easeInOut",
                            }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="قائمة التنقل"
                            className="fixed inset-y-0 right-0 z-65 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-ivory shadow-2xl"
                        >
                            {/* Drawer header */}
                            <div className="flex min-h-22.5 items-center justify-between border-b border-forest/10 px-5">
                                <Link
                                    href="/"
                                    onClick={closeMobileMenu}
                                    className="flex flex-col items-center"
                                >
                                    <span className="sr-only">Amalia Jewellery — الصفحة الرئيسية</span>
                                    <Wordmark className="amalia-brand-name w-40" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={closeMobileMenu}
                                    aria-label="إغلاق القائمة"
                                    className="amalia-icon-button"
                                >
                                    <X size={23} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Main links */}
                            <nav
                                aria-label="التنقل على الهاتف"
                                className="px-5 py-5"
                            >
                                {mainLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href + link.label}
                                        initial={
                                            shouldReduceMotion
                                                ? false
                                                : { opacity: 0, x: 12 }
                                        }
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: shouldReduceMotion ? 0 : 0.2,
                                            delay: shouldReduceMotion ? 0 : index * 0.04,
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            aria-current={current(link.href)}
                                            onClick={closeMobileMenu}
                                            className="flex min-h-13.75 items-center justify-between border-b border-forest/10 text-sm font-medium text-forest transition-colors hover:text-gold-deep"
                                        >
                                            {link.label}

                                            <ArrowLeft
                                                size={16}
                                                className="text-gold"
                                            />
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Categories accordion */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCategoriesOpen((previous) => !previous)
                                    }
                                    aria-expanded={categoriesOpen}
                                    className="flex min-h-13.75 w-full items-center justify-between border-b border-forest/10 text-sm font-medium text-forest"
                                >
                                    تصفحي حسب النوع

                                    <ChevronDown
                                        size={18}
                                        className={`text-gold transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {categoriesOpen && (
                                        <motion.div
                                            initial={
                                                shouldReduceMotion
                                                    ? false
                                                    : { height: 0, opacity: 0 }
                                            }
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                duration: shouldReduceMotion ? 0 : 0.2,
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-b border-forest/10 py-2 pr-4">
                                                {categoryLinks.map((category) => (
                                                    <Link
                                                        key={category.href + category.label}
                                                        href={category.href}
                                                        aria-current={current(category.href)}
                                                        onClick={closeMobileMenu}
                                                        className="flex min-h-10.75 items-center text-sm text-forest/75 transition-colors hover:text-gold-deep"
                                                    >
                                                        {category.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </nav>

                            {/* Drawer actions */}
                            <div className="mt-auto border-t border-forest/10 px-5 py-5">
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {
                                            label: "حسابي",
                                            href: "/account",
                                            icon: UserRound,
                                        },
                                        {
                                            label: "واتساب",
                                            href: contactWhatsappUrl,
                                            icon: MessageCircle,
                                        },
                                        {
                                            label: "حقيبة التسوق",
                                            href: "/cart",
                                            icon: ShoppingBag,
                                        },
                                    ].map(({ label, href, icon: Icon }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={closeMobileMenu}
                                            className="flex min-h-19 flex-col items-center justify-center gap-2 border border-forest/10 text-xs text-forest transition-colors hover:border-gold hover:text-gold-deep"
                                        >
                                            <Icon size={20} strokeWidth={1.5} />
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

