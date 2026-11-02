"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Minus, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import { authClient } from "@/lib/auth-client";
import { cart, MAX_QTY, useCart } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/cn";
import { siteConfig, whatsappLink } from "@/lib/site";

export type CartProduct = {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    hasCutout: boolean;
    available: boolean;
    detail: string;
};

const SHIPPING = [
    { id: "delivery", label: "توصيل إلى العنوان", note: "أرامكس أو سمسا", price: siteConfig.shipping.delivery },
    { id: "pickup", label: "استلام من فرع سمسا", note: "أقرب فرع لكِ", price: siteConfig.shipping.pickup },
] as const;

type ShippingId = (typeof SHIPPING)[number]["id"];

// True only after hydration, so the bag (stored in the browser) never flashes "empty" first.
const useHydrated = () =>
    useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

export default function CartView({ products }: { products: CartProduct[] }) {
    const hydrated = useHydrated();
    const { lines } = useCart();
    const { data: session, isPending } = authClient.useSession();
    const [shippingId, setShippingId] = useState<ShippingId>("delivery");

    if (!hydrated) return <CartSkeleton />;

    const items = lines
        .map((line) => ({ line, product: products.find((product) => product.id === line.id) }))
        .filter((item): item is { line: typeof item.line; product: CartProduct } => Boolean(item.product));

    if (items.length === 0) return <EmptyBag />;

    const payable = items.filter(({ product }) => product.available);
    const subtotal = payable.reduce((sum, { line, product }) => sum + line.qty * product.price, 0);
    const shipping = SHIPPING.find((option) => option.id === shippingId)!;
    const total = subtotal + shipping.price;

    const orderMessage = [
        "مرحبا، أرغب بإتمام طلبي من بيبي أماليا:",
        ...payable.map(({ line, product }) => `• ${product.name} × ${line.qty} — ${formatPrice(product.price * line.qty)}`),
        `الشحن: ${shipping.label} — ${formatPrice(shipping.price)}`,
        `الإجمالي: ${formatPrice(total)}`,
        session?.user && "phoneNumber" in session.user ? `رقم الجوال: ${session.user.phoneNumber}` : "",
    ]
        .filter(Boolean)
        .join("\n");

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
            <section aria-labelledby="bag-items-title">
                <h2 id="bag-items-title" className="sr-only">
                    القطع في حقيبتك
                </h2>
                <ul className="divide-y divide-forest/10 border-y border-forest/10">
                    {items.map(({ line, product }) => (
                        <li key={product.id} className="flex gap-4 py-6 sm:gap-6">
                            <Link
                                href={`/product/${product.slug}`}
                                className="amalia-arch relative aspect-3/4 w-24 shrink-0 overflow-hidden bg-forest-deep sm:w-28"
                                tabIndex={-1}
                                aria-hidden="true"
                            >
                                <Image
                                    src={product.image}
                                    alt=""
                                    fill
                                    sizes="112px"
                                    className={product.hasCutout ? "object-contain p-3" : "object-cover"}
                                />
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-xs text-gold-ink">{product.detail}</p>
                                        <h3 className="mt-1 text-base font-medium text-forest sm:text-lg">
                                            <Link href={`/product/${product.slug}`} className="hover:text-gold-deep">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-forest/70 tabular-nums">{formatPrice(product.price)}</p>
                                    </div>
                                    <p className="shrink-0 text-base font-medium text-forest tabular-nums">
                                        {formatPrice(product.price * line.qty)}
                                    </p>
                                </div>

                                {!product.available && (
                                    <p className="mt-2 text-sm text-forest/70">نفدت الكمية — لن تُحتسب في الطلب.</p>
                                )}

                                <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                                    <div className="inline-flex items-center rounded-full border border-forest/15" role="group" aria-label={`كمية ${product.name}`}>
                                        <button
                                            type="button"
                                            onClick={() => cart.setQty(product.id, line.qty - 1)}
                                            disabled={line.qty <= 1}
                                            aria-label="إنقاص الكمية"
                                            className="grid size-11 place-items-center rounded-full text-forest transition-colors hover:text-gold-deep disabled:opacity-30"
                                        >
                                            <Minus size={16} strokeWidth={1.5} />
                                        </button>
                                        <output aria-live="polite" className="w-8 text-center text-base font-medium text-forest tabular-nums">
                                            {line.qty}
                                        </output>
                                        <button
                                            type="button"
                                            onClick={() => cart.setQty(product.id, line.qty + 1)}
                                            disabled={line.qty >= MAX_QTY}
                                            aria-label="زيادة الكمية"
                                            className="grid size-11 place-items-center rounded-full text-forest transition-colors hover:text-gold-deep disabled:opacity-30"
                                        >
                                            <Plus size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => cart.remove(product.id)}
                                        className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm text-forest/70 transition-colors hover:text-forest"
                                    >
                                        <Trash2 size={16} strokeWidth={1.5} />
                                        إزالة
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <Link href="/shop" className="mt-6 inline-flex h-11 items-center gap-2 text-sm text-forest/70 transition-colors hover:text-gold-deep">
                    <ArrowLeft size={16} strokeWidth={1.5} className="rotate-180" />
                    متابعة التسوق
                </Link>
            </section>

            <aside aria-labelledby="summary-title" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
                <div className="grain relative overflow-hidden rounded-[1.75rem] bg-forest-deep p-6 text-ivory sm:p-8">
                    <h2 id="summary-title" className="text-2xl">
                        ملخص الطلب
                    </h2>

                    <fieldset className="mt-6">
                        <legend className="text-sm text-ivory/70">طريقة الشحن</legend>
                        <div className="mt-3 space-y-2">
                            {SHIPPING.map((option) => (
                                <label
                                    key={option.id}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors",
                                        option.id === shippingId ? "border-gold bg-gold/10" : "border-ivory/15 hover:border-ivory/30"
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value={option.id}
                                        checked={option.id === shippingId}
                                        onChange={() => setShippingId(option.id)}
                                        className="size-4 accent-gold"
                                    />
                                    <span className="flex-1">
                                        <span className="block text-sm font-medium">{option.label}</span>
                                        <span className="block text-xs text-ivory/60">{option.note} · {siteConfig.shipping.days}</span>
                                    </span>
                                    <span className="text-sm tabular-nums">{formatPrice(option.price)}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <dl className="mt-6 space-y-3 border-t border-ivory/10 pt-6 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-ivory/70">المجموع الفرعي</dt>
                            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-ivory/70">الشحن</dt>
                            <dd className="tabular-nums">{formatPrice(shipping.price)}</dd>
                        </div>
                        <div className="flex justify-between border-t border-ivory/10 pt-4 text-lg">
                            <dt>الإجمالي</dt>
                            <dd className="font-medium text-gold-light tabular-nums">{formatPrice(total)}</dd>
                        </div>
                    </dl>

                    <div className="mt-8">
                        {isPending ? (
                            <div className="h-13 animate-pulse rounded-full bg-ivory/10" aria-hidden="true" />
                        ) : session ? (
                            <>
                                <a
                                    href={whatsappLink(orderMessage)}
                                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-medium text-forest-deep transition-colors hover:bg-gold-light"
                                >
                                    إتمام الطلب عبر واتساب
                                    <ArrowLeft size={18} strokeWidth={1.5} />
                                </a>
                                <p className="mt-3 text-center text-xs leading-6 text-ivory/60">
                                    الدفع الإلكتروني بمدى وApple Pay قريبًا. حتى ذلك الحين نؤكد طلبك ونرسل رابط الدفع عبر واتساب.
                                </p>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login?redirect=/cart"
                                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-[0.9375rem] font-medium text-forest-deep transition-colors hover:bg-gold-light"
                                >
                                    <LockKeyhole size={18} strokeWidth={1.5} />
                                    سجّلي دخولك لإتمام الطلب
                                </Link>
                                <p className="mt-3 text-center text-xs leading-6 text-ivory/60">
                                    برقم جوالك فقط — نرسل لكِ رمز تحقق في ثوانٍ.
                                </p>
                            </>
                        )}
                    </div>

                    <ul className="mt-8 space-y-3 border-t border-ivory/10 pt-6 text-xs text-ivory/70">
                        <li className="flex items-center gap-2">
                            <Truck size={16} strokeWidth={1.5} className="text-gold" />
                            شحن لجميع مناطق المملكة مع رقم تتبع
                        </li>
                        <li className="flex items-center gap-2">
                            <ShieldCheck size={16} strokeWidth={1.5} className="text-gold" />
                            ذهب عيار 18 بحرفية أوروبية
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}

function EmptyBag() {
    return (
        <div className="mx-auto max-w-md py-10 text-center">
            <Emblem className="mx-auto size-14" />
            <h2 className="mt-6 text-3xl">حقيبتك فارغة</h2>
            <p className="mt-3 leading-8 text-forest/70">
                قطع صغيرة تحمل حبًا كبيرًا بانتظارك في البوتيك.
            </p>
            <Link
                href="/shop"
                className="mt-8 inline-flex min-h-13 items-center gap-2 rounded-full bg-forest px-8 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep"
            >
                ادخلي البوتيك
                <ArrowLeft size={18} strokeWidth={1.5} />
            </Link>
        </div>
    );
}

function CartSkeleton() {
    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14" aria-busy="true" aria-label="جارٍ تحميل الحقيبة">
            <div className="space-y-6">
                {[0, 1].map((index) => (
                    <div key={index} className="flex gap-6 border-b border-forest/10 pb-6">
                        <div className="amalia-arch aspect-3/4 w-28 animate-pulse bg-forest/10" />
                        <div className="flex-1 space-y-3 pt-2">
                            <div className="h-4 w-1/3 animate-pulse rounded bg-forest/10" />
                            <div className="h-5 w-2/3 animate-pulse rounded bg-forest/10" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-96 animate-pulse rounded-[1.75rem] bg-forest/10" />
        </div>
    );
}
