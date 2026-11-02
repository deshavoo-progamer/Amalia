import type { ReactNode } from "react";
import Image from "next/image";

import Emblem from "@/components/brand/Emblem";

import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import Reveal from "./Reveal";

type PageHeaderProps = {
    eyebrow: string;
    title: string;
    description?: string;
    breadcrumbs: Crumb[];
    /** Editorial banner photo, framed in an arch beside the title on large screens. */
    image?: { src: string; alt: string };
    children?: ReactNode;
};

const sparkles = [
    { top: "22%", left: "10%", size: 8, delay: 0 },
    { top: "64%", left: "88%", size: 6, delay: 1.4 },
    { top: "30%", left: "78%", size: 5, delay: 2.2 },
];

/** Compact dark hero used by inner pages; shares the home hero's grain, sparkles and emblem. */
export default function PageHeader({ eyebrow, title, description, breadcrumbs, image, children }: PageHeaderProps) {
    return (
        <header className="grain relative isolate overflow-hidden bg-forest-deep text-ivory">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(198_165_117/18%)_0%,transparent_60%)]"
            />
            <Emblem className="amalia-spin-slow absolute -bottom-24 -left-20 -z-10 size-72 opacity-[0.07] sm:size-96" />
            {sparkles.map((sparkle, index) => (
                <span
                    key={index}
                    aria-hidden="true"
                    className="amalia-sparkle"
                    style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        width: sparkle.size,
                        height: sparkle.size,
                        animationDelay: `${sparkle.delay}s`,
                    }}
                />
            ))}

            <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
                <Breadcrumbs items={breadcrumbs} tone="dark" />

                <div className="mt-8 flex items-center justify-between gap-12">
                    <div className="min-w-0 flex-1">
                        <Reveal className="max-w-3xl">
                            <p className="amalia-eyebrow">{eyebrow}</p>
                            <h1 className="mt-4 text-3xl text-balance sm:text-4xl lg:text-5xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-5 max-w-2xl text-base leading-8 text-pretty text-ivory/70 sm:text-lg">
                                    {description}
                                </p>
                            )}
                        </Reveal>

                        {children}
                    </div>

                    {image && (
                        // Desktop only: on phones the products should start right after the title.
                        <div className="relative hidden w-64 shrink-0 lg:block xl:w-72">
                            <span
                                aria-hidden="true"
                                className="amalia-arch absolute -inset-3 border border-gold/30"
                            />
                            <div className="amalia-arch relative aspect-4/5 overflow-hidden bg-forest shadow-[0_40px_80px_-30px_rgb(0_0_0/70%)]">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(min-width: 1280px) 288px, 256px"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
