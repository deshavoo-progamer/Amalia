import type { Metadata } from "next";

import CartView, { type CartProduct } from "@/components/cart/CartView";
import PageHeader from "@/components/ui/PageHeader";
import { getCategory, getProducts, type Product } from "@/data/catalog";

export const metadata: Metadata = {
    title: "حقيبة التسوق",
    alternates: { canonical: "/cart" },
    robots: { index: false, follow: true },
};

// Only what the bag needs (no stories/blur data) is sent to the browser.
const toCartProduct = (product: Product): CartProduct => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.cutout ?? product.image,
    hasCutout: Boolean(product.cutout),
    available: product.available,
    detail: [getCategory(product.category)?.title, product.karat && `عيار ${product.karat}`].filter(Boolean).join(" · "),
});

export default async function CartPage() {
    const cartProducts = (await getProducts()).map(toCartProduct);

    return (
        <main id="main-content">
            <PageHeader
                eyebrow="Your Bag"
                title="حقيبة التسوق"
                breadcrumbs={[{ label: "حقيبة التسوق", href: "/cart" }]}
            />

            <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                <CartView products={cartProducts} />
            </div>
        </main>
    );
}
