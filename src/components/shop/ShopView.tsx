import Link from "next/link";

import Emblem from "@/components/brand/Emblem";
import { JsonLdScript } from "@/components/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import type { Crumb } from "@/components/ui/Breadcrumbs";
import { categories, type CategoryKey, type Product } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { absoluteUrl, contactWhatsappUrl } from "@/lib/site";

import ProductGrid from "./ProductGrid";

type ShopViewProps = {
    active?: CategoryKey;
    image?: { src: string; alt: string };
    eyebrow: string;
    title: string;
    description: string;
    breadcrumbs: Crumb[];
    products: Product[];
};

export default function ShopView({ active, image, eyebrow, title, description, breadcrumbs, products }: ShopViewProps) {
    const tabs = [{ key: undefined, title: "الكل", href: "/shop" }, ...categories.map((c) => ({ key: c.key, title: c.title, href: `/shop/${c.key}` }))];

    return (
        <main id="main-content">
            <PageHeader eyebrow={eyebrow} title={title} description={description} breadcrumbs={breadcrumbs} image={image}>
                <nav aria-label="تصنيفات المتجر" className="mt-10 -mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
                    <ul className="flex w-max gap-2">
                        {tabs.map((tab) => {
                            const isActive = tab.key === active;

                            return (
                                <li key={tab.href}>
                                    <Link
                                        href={tab.href}
                                        aria-current={isActive ? "page" : undefined}
                                        className={cn(
                                            "inline-flex h-11 items-center rounded-full border px-5 text-sm transition-colors duration-300",
                                            isActive
                                                ? "border-gold bg-gold text-forest-deep"
                                                : "border-ivory/20 text-ivory/80 hover:border-gold hover:text-gold-light"
                                        )}
                                    >
                                        {tab.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </PageHeader>

            <section aria-labelledby="products-title" className="amalia-wall grain relative isolate py-16 text-ivory sm:py-24">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                    <h2 id="products-title" className="sr-only">
                        قطع {title}
                    </h2>
                    {products.length > 0 ? (
                        <>
                            <p className="mb-12 text-center text-sm text-ivory/60">{products.length} قطعة في البوتيك</p>
                            <ProductGrid products={products} />
                        </>
                    ) : (
                        <ComingSoon />
                    )}
                </div>
            </section>

            <JsonLdScript
                data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    name: title,
                    description,
                    url: absoluteUrl(breadcrumbs.at(-1)?.href),
                    mainEntity: {
                        "@type": "ItemList",
                        numberOfItems: products.length,
                        itemListElement: products.map((product, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            url: absoluteUrl(`/product/${product.slug}`),
                            name: product.name,
                        })),
                    },
                }}
            />
        </main>
    );
}

/** An audience or category that has no pieces yet (e.g. the women's line before launch). */
function ComingSoon() {
    return (
        <div className="mx-auto max-w-lg py-10 text-center">
            <Emblem className="amalia-spin-slow mx-auto size-16" />
            <p lang="en" className="mt-8 font-display text-2xl text-gold italic">
                Coming soon
            </p>
            <p className="mt-3 text-2xl">قطع جديدة في الطريق إلى البوتيك</p>
            <p className="mt-4 leading-8 text-ivory/70">
                نجهّز هذه المجموعة بعناية. اتركي لنا رسالة لنخبرك أول ما تصل، أو تجوّلي في مجموعاتنا الحالية.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                    href="/shop"
                    className="inline-flex min-h-11 items-center rounded-full bg-gold px-6 text-sm font-medium text-forest-deep transition-colors hover:bg-gold-light"
                >
                    تسوقي المجموعات الحالية
                </Link>
                <a
                    href={contactWhatsappUrl}
                    className="inline-flex min-h-11 items-center rounded-full border border-ivory/25 px-6 text-sm text-ivory transition-colors hover:border-gold hover:text-gold-light"
                >
                    أعلميني عند الإطلاق
                </a>
            </div>
        </div>
    );
}
