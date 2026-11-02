import { Suspense } from "react";
import type { Metadata } from "next";

import SearchResults from "@/components/shop/SearchResults";
import PageHeader from "@/components/ui/PageHeader";
import { getProducts } from "@/data/catalog";

export const metadata: Metadata = {
    title: "البحث",
    alternates: { canonical: "/search" },
    robots: { index: false, follow: true },
};

export default async function SearchPage() {
    const products = await getProducts();

    return (
        <main id="main-content">
            <PageHeader
                eyebrow="البحث"
                title="ابحثي عن قطعتك المفضلة"
                breadcrumbs={[{ label: "البحث", href: "/search" }]}
            />

            <section aria-labelledby="results-title" className="amalia-wall grain relative isolate min-h-[60vh] py-14 text-ivory sm:py-20">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                    <h2 id="results-title" className="sr-only">
                        نتائج البحث
                    </h2>
                    <Suspense>
                        <SearchResults products={products} />
                    </Suspense>
                </div>
            </section>
        </main>
    );
}
