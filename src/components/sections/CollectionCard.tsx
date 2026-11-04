"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Emblem from "@/components/brand/Emblem";
import type { Collection } from "@/data/editorial";
import { cn } from "@/lib/cn";

type CollectionCardProps = {
    collection: Collection;
    sizes: string;
    className?: string;
};

export default function CollectionCard({
    collection,
    sizes,
    className,
}: CollectionCardProps) {
    const ref = useRef<HTMLElement>(null);

    function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
        if (event.pointerType !== "mouse" || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        ref.current.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        ref.current.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }

    return (
        <article
            ref={ref}
            id={collection.id}
            onPointerMove={handlePointerMove}
            className={cn(
                "amalia-collection-card group relative isolate overflow-hidden",
                collection.image ? "bg-forest-deep" : "bg-forest",
                className
            )}
        >
            {collection.image ? (
                <Image
                    src={collection.image}
                    alt={collection.alt ?? collection.title}
                    fill
                    sizes={sizes}
                    className="amalia-collection-image -z-20 object-cover"
                    style={{ objectPosition: collection.imagePosition }}
                />
            ) : (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-20 grid place-items-center pb-32"
                >
                    <Emblem className="amalia-collection-emblem size-[42%] max-w-48 opacity-90" />
                </div>
            )}

            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-t from-forest-deep/95 via-forest-deep/40 via-35% to-transparent to-70% transition-opacity duration-700 group-hover:opacity-90"
            />
            <div aria-hidden="true" className="amalia-spotlight" />

            {/* Animated frame */}
            <svg
                aria-hidden="true"
                className="amalia-frame pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
            >
                <rect x="0.5" y="0.5" pathLength="1" />
            </svg>

            <Link
                href={collection.href}
                className="relative flex h-full flex-col justify-end p-6 text-ivory outline-none sm:p-8"
            >
                <span className="block">
                    <span className="amalia-collection-title block text-3xl font-medium sm:text-4xl">
                        {collection.title}
                    </span>
                    <span className="mt-3 block max-w-xs text-sm leading-7 text-ivory/70">
                        {collection.description}
                    </span>

                    <span className="amalia-collection-cta mt-5 inline-flex items-center gap-2 text-sm text-gold-light">
                        اكتشفي المجموعة
                        <ArrowLeft size={16} strokeWidth={1.5} />
                    </span>
                </span>

                {/* Expands the link to the whole card for pointer users */}
                <span aria-hidden="true" className="absolute inset-0" />
            </Link>
        </article>
    );
}
