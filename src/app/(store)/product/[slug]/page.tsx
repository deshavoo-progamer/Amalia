import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, Gem, MessageCircle, RefreshCcw, Sparkles, Truck } from "lucide-react";

import { JsonLdScript } from "@/components/JsonLd";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductGrid from "@/components/shop/ProductGrid";
import StickyBuyBar from "@/components/shop/StickyBuyBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MagneticLink from "@/components/ui/MagneticLink";
import SectionHeading from "@/components/ui/SectionHeading";
import {
    getCategory,
    getProduct,
    getRelatedProducts,
    productAlt,
    getProducts,
    type Product,
} from "@/data/catalog";
import { formatPrice } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig, whatsappLink } from "@/lib/site";

// Pieces added from /admin after a deploy render on first visit, then stay cached.
export async function generateStaticParams() {
    return (await getProducts()).map((product) => ({ slug: product.slug }));
}

const DEFAULT_CARE =
    "للحفاظ على لمعة القطعة يُفضّل تجنب ملامستها للعطور والمواد الكيميائية. كل قطعة تُصنع بحب وعناية، وقد تظهر اختلافات طفيفة في الوزن من قطعة لأخرى.";

function describe(product: Product) {
    if (product.story && product.story.length >= 90) return product.story;

    // Many imported pieces share a generic name ("اقراط ذهب") or a one-line story,
    // so the generated text leans on what makes each piece unique.
    const category = getCategory(product.category);
    const details = [
        product.karat && `ذهب عيار ${product.karat}`,
        product.weight && `بوزن ${product.weight} جرام`,
        product.code && `رمز ${product.code}`,
    ].filter(Boolean);
    const generated = `${product.name} من مجموعة ${category?.title ?? "المجوهرات"} في بيبي أماليا${details.length ? ` (${details.join("، ")})` : ""}، ${product.audience === "kids" ? "مصممة بعناية لتناسب بشرة الأطفال الحساسة" : "بتصميم راقٍ يكمّل إطلالتك"} بحرفية أوروبية.`;

    return product.story ? `${product.story} ${generated}` : generated;
}

// Names shared by several pieces ("اقراط ذهب") get the reference code so every title is unique.
async function seoTitle(product: Product) {
    const names = (await getProducts()).map((item) => item.name);
    const repeated = names.indexOf(product.name) !== names.lastIndexOf(product.name);
    const karat = product.karat ? (product.name.includes("ذهب") ? ` عيار ${product.karat}` : ` ذهب عيار ${product.karat}`) : "";
    const code = repeated && product.code ? ` ${product.code}` : "";
    return `${product.name}${karat}${code}`;
}

function seoDescription(product: Product) {
    const price = ` — ${formatPrice(product.price)}`;
    const text = describe(product);
    const max = 155 - price.length;
    return (text.length > max ? `${text.slice(0, text.lastIndexOf(" ", max))}…` : text) + price;
}

async function findProduct(params: PageProps<"/product/[slug]">["params"]) {
    const { slug } = await params;
    return getProduct(decodeURIComponent(slug));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
    const product = await findProduct(params);
    if (!product) return {};

    return pageMetadata({
        title: await seoTitle(product),
        description: seoDescription(product),
        path: `/product/${product.slug}`,
        image: { url: product.image, width: product.width, height: product.height, alt: productAlt(product) },
    });
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
    const product = await findProduct(params);
    if (!product) notFound();

    const category = getCategory(product.category)!;
    const related = await getRelatedProducts(product);
    const isEarring = product.category === "earrings";
    const orderMessage = `مرحبا، أرغب بطلب: ${product.name}${product.code ? ` (كود ${product.code})` : ""}\n${absoluteUrl(`/product/${product.slug}`)}`;

    const specs = [
        { label: "عيار الذهب", value: product.karat ? `${product.karat} قيراط` : undefined },
        { label: "الوزن التقريبي", value: product.weight ? `${product.weight} جرام` : undefined },
        { label: "رمز القطعة", value: product.code },
        { label: "التصنيف", value: category.title },
    ].filter((spec): spec is { label: string; value: string } => Boolean(spec.value));

    const services = [
        { icon: Truck, title: "الشحن", text: `لجميع مناطق المملكة خلال ${siteConfig.shipping.days} — استلام من فرع سمسا ${siteConfig.shipping.pickup} ر.س أو توصيل للعنوان ${siteConfig.shipping.delivery} ر.س.` },
        { icon: CreditCard, title: "الدفع", text: `${siteConfig.payments.join("، ")}.` },
        {
            icon: RefreshCcw,
            title: "الاستبدال",
            text: isEarring
                ? "لأسباب صحية لا يمكن إرجاع أو استبدال الأقراط والقطع الملامسة للجلد."
                : "الاستبدال خلال يوم من الاستلام في حال وجود عيب مصنعي واضح.",
        },
    ];

    const productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${absoluteUrl(`/product/${product.slug}`)}#product`,
        name: product.name,
        description: describe(product),
        image: [product.image, product.cutout].filter(Boolean).map((src) => absoluteUrl(src)),
        sku: product.code ?? product.id,
        category: category.title,
        material: product.karat ? `ذهب عيار ${product.karat}` : "ذهب",
        brand: { "@type": "Brand", name: siteConfig.nameEn },
        ...(product.weight && {
            weight: { "@type": "QuantitativeValue", value: product.weight, unitCode: "GRM" },
        }),
        offers: {
            "@type": "Offer",
            url: absoluteUrl(`/product/${product.slug}`),
            price: product.price,
            priceCurrency: siteConfig.currency,
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${siteConfig.url}/#store` },
            shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", value: siteConfig.shipping.delivery, currency: siteConfig.currency },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "SA" },
                deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
                },
            },
            hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "SA",
                ...(isEarring
                    ? { returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted" }
                    : {
                          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                          merchantReturnDays: 1,
                          returnFees: "https://schema.org/ReturnShippingFees",
                      }),
            },
        },
    };

    return (
        <main id="main-content" className="bg-ivory">
            <JsonLdScript data={productLd} />

            <div className="mx-auto max-w-[1600px] px-4 pt-8 pb-20 sm:px-8 sm:pt-10 lg:px-12">
                <Breadcrumbs
                    items={[
                        { label: "المتجر", href: "/shop" },
                        { label: category.title, href: `/shop/${category.key}` },
                        { label: product.name, href: `/product/${product.slug}` },
                    ]}
                />

                <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* No scroll reveal here: the photo is the LCP and the details are buying info — both show at once. */}
                    <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
                        <ProductGallery product={product} />
                    </div>

                    <div>
                        <p className="amalia-eyebrow">
                            {category.titleEn}
                            {product.karat && ` · ${product.karat}K Gold`}
                        </p>
                        <h1 className="mt-4 text-3xl text-balance text-forest sm:text-4xl">
                            {product.name}
                        </h1>
                        {product.code && (
                            <p lang="en" className="mt-1 font-display text-lg text-forest/70 italic">
                                Ref. {product.code}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <p className="text-2xl font-medium text-forest tabular-nums sm:text-3xl">{formatPrice(product.price)}</p>
                            <span
                                className={
                                    product.available
                                        ? "rounded-full bg-gold/15 px-3 py-1 text-xs text-gold-ink"
                                        : "rounded-full bg-forest/10 px-3 py-1 text-xs text-forest/70"
                                }
                            >
                                {product.available ? "متوفر" : "نفدت الكمية"}
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-forest/70">قد يختلف الوزن قليلًا من قطعة لأخرى</p>

                        <p className="mt-8 text-base leading-8 text-pretty text-forest/75 sm:text-lg">{describe(product)}</p>

                        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-forest/10 bg-forest/10">
                            {specs.map((spec) => (
                                <div key={spec.label} className="bg-ivory p-4 sm:p-5">
                                    <dt className="text-xs text-forest/70">{spec.label}</dt>
                                    <dd className="mt-1 text-base font-medium text-forest" dir="auto">
                                        {spec.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {product.available ? (
                                <AddToCartButton productId={product.id} name={product.name} available />
                            ) : (
                                <MagneticLink href={whatsappLink(orderMessage)} variant="forest">
                                    أعلميني عند التوفر
                                    <ArrowLeft size={18} strokeWidth={1.5} />
                                </MagneticLink>
                            )}
                            <a
                                href={whatsappLink(orderMessage)}
                                className="inline-flex min-h-13 items-center gap-2 rounded-full border border-forest/20 px-8 text-[0.9375rem] font-medium text-forest transition-colors hover:border-gold hover:text-gold-deep"
                            >
                                <MessageCircle size={18} strokeWidth={1.5} />
                                اطلبي عبر واتساب
                            </a>
                        </div>

                        <ul className="mt-10 space-y-4">
                            {services.map(({ icon: Icon, title, text }) => (
                                <li key={title} className="flex gap-4 rounded-2xl border border-forest/10 bg-white/50 p-5">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-deep">
                                        <Icon size={18} strokeWidth={1.5} />
                                    </span>
                                    <div>
                                        <h2 className="font-sans text-sm font-medium text-forest">{title}</h2>
                                        <p className="mt-1 text-sm leading-7 text-forest/65">{text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 rounded-2xl bg-forest p-6 text-ivory">
                            <h2 className="flex items-center gap-2 font-sans text-sm font-medium text-gold">
                                <Sparkles size={16} strokeWidth={1.5} />
                                العناية بالقطعة
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-ivory/75">{product.care ?? DEFAULT_CARE}</p>
                        </div>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section aria-labelledby="related-title" className="amalia-wall grain relative isolate py-20 text-ivory sm:py-28">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                            <SectionHeading
                                id="related-title"
                                eyebrow="قد يعجبكِ أيضًا"
                                title={`المزيد من ${category.title}`}
                                tone="dark"
                            />
                            <MagneticLink href={`/shop/${category.key}`} variant="gold" className="shrink-0">
                                <Gem size={18} strokeWidth={1.5} />
                                عرض كل {category.title}
                            </MagneticLink>
                        </div>
                        <div className="mt-14">
                            <ProductGrid products={related} />
                        </div>
                    </div>
                </section>
            )}
            <StickyBuyBar
                name={product.name}
                price={product.price}
                available={product.available}
                productId={product.id}
                whatsappUrl={whatsappLink(orderMessage)}
            />
        </main>
    );
}
