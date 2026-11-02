import { ArrowLeft } from "lucide-react";

import NicheCard from "@/components/shop/NicheCard";
import MagneticLink from "@/components/ui/MagneticLink";
import Reveal from "@/components/ui/Reveal";
import { getFeaturedProducts } from "@/data/catalog";

/** The boutique wall: a single row of lit niches, like standing in front of the store display. */
export default async function FeaturedProducts() {
    const pieces = await getFeaturedProducts(5);

    return (
        <section
            id="featured"
            aria-labelledby="featured-title"
            className="amalia-wall grain relative isolate overflow-hidden py-24 text-ivory sm:py-32"
        >
            <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                <Reveal as="header" className="mx-auto max-w-2xl text-center">
                    <p className="amalia-eyebrow justify-center">The Boutique</p>
                    <h2
                        id="featured-title"
                        className="mt-4 text-3xl text-balance sm:text-4xl lg:text-5xl"
                    >
                        مختارات <span className="text-gold-gradient">البوتيك</span>
                    </h2>
                    <p className="mt-5 text-base leading-8 text-pretty text-ivory/60 sm:text-lg">
                        قفي أمام كل قطعة، ودعي الضوء يكشف لكِ تفاصيلها.
                    </p>
                </Reveal>
            </div>

            {/* Mobile: walk along the wall (horizontal snap). Desktop: one calm row. */}
            <ul className="mx-auto mt-16 flex max-w-[1600px] snap-x snap-mandatory gap-6 overflow-x-auto px-[16vw] pb-6 [scrollbar-width:none] sm:px-8 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:px-8 lg:gap-8 lg:px-12">
                {pieces.map((product, index) => (
                    <Reveal
                        key={product.id}
                        as="li"
                        delay={index * 0.12}
                        className="w-[68vw] shrink-0 snap-center pt-2 md:w-auto"
                    >
                        <NicheCard
                            product={product}
                            float
                            index={index}
                            sizes="(min-width: 768px) 20vw, 68vw"
                        />
                    </Reveal>
                ))}
            </ul>

            {/* The display's floor line */}
            <div
                aria-hidden="true"
                className="mx-auto mt-10 h-px max-w-5xl bg-linear-to-r from-transparent via-gold/40 to-transparent"
            />

            <Reveal className="mt-12 flex justify-center px-4">
                <MagneticLink href="/shop" variant="gold">
                    ادخلي البوتيك
                    <ArrowLeft size={18} strokeWidth={1.5} />
                </MagneticLink>
            </Reveal>
        </section>
    );
}
