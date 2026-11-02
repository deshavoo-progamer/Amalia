import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCategory, productAlt, type Product } from "@/data/taxonomy";
import { cn, formatPrice } from "@/lib/cn";

import AddToCartButton from "./AddToCartButton";
import WishButton from "./WishButton";

type NicheCardProps = {
    product: Product;
    sizes?: string;
    priority?: boolean;
    /** Gentle idle bob — for showcases with only a handful of niches on screen. */
    float?: boolean;
    index?: number;
};

/**
 * A product displayed like a piece in a lit boutique niche. Light, lift and the
 * revealed details are all driven by the CSS `--lit` variable (hover, focus, or
 * mid-screen on touch — see effects.css), so the card itself ships no JavaScript.
 */
export default function NicheCard({
    product,
    sizes = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 46vw",
    priority = false,
    float = false,
    index = 0,
}: NicheCardProps) {
    const href = `/product/${product.slug}`;
    const category = getCategory(product.category);

    return (
        <article
            className={cn("amalia-niche group", float && "amalia-niche--float")}
            style={{ "--i": index } as CSSProperties}
        >
            <div className="amalia-niche-alcove">
                {product.cutout ? (
                    <div className="amalia-niche-piece">
                        <div className="amalia-niche-bob relative size-full">
                            <Image
                                src={product.cutout}
                                alt={productAlt(product)}
                                fill
                                sizes={sizes}
                                preload={priority}
                                className={cn("object-contain", !product.available && "opacity-50 grayscale-[40%]")}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="amalia-niche-card">
                        <Image
                            src={product.image}
                            alt={productAlt(product)}
                            fill
                            sizes={sizes}
                            preload={priority}
                            placeholder="blur"
                            blurDataURL={product.blur}
                            className="object-cover"
                        />
                    </div>
                )}

                <span aria-hidden="true" className="amalia-niche-glint" />

                {!product.available && (
                    <span className="absolute bottom-[5%] left-1/2 z-10 -translate-x-1/2 rounded-full border border-ivory/20 bg-forest-deep/80 px-3 py-1 text-[11px] whitespace-nowrap text-ivory/80">
                        نفدت الكمية
                    </span>
                )}
            </div>

            <div className="mt-6 px-1 text-center">
                <p className="text-[11px] tracking-wide text-gold">
                    {category?.title}
                    {product.karat && ` · عيار ${product.karat}`}
                </p>
                <h3 className="amalia-niche-name mt-1.5 text-base font-medium sm:text-lg">
                    {/* Stretched link: the whole niche opens the product */}
                    <Link
                        href={href}
                        className="outline-none after:absolute after:inset-0 after:rounded-t-full focus-visible:after:ring-2 focus-visible:after:ring-gold"
                    >
                        {product.name}
                    </Link>
                </h3>

                <div className="amalia-niche-reveal">
                    <p className="mt-1.5 text-base font-medium text-gold-light tabular-nums">{formatPrice(product.price)}</p>

                    <div className="relative z-10 mt-4 flex items-center justify-center gap-2">
                        <WishButton name={product.name} />

                        <Link
                            href={href}
                            tabIndex={-1}
                            className="amalia-niche-cta inline-flex h-11 items-center gap-1.5 rounded-full bg-gold px-4 text-xs font-medium text-forest-deep transition-colors hover:bg-gold-light sm:px-5 sm:text-sm"
                        >
                            اكتشفي
                            <ArrowLeft size={15} strokeWidth={1.5} />
                        </Link>

                        {product.available && (
                            <AddToCartButton productId={product.id} name={product.name} available variant="icon" />
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
